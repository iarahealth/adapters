import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { IaraEditorInferenceFormatter } from "../../editor/formatter";
import {
  IaraSpeechRecognition,
  IaraSpeechRecognitionDetail,
} from "../../speech";
import { IaraSyncfusionConfig } from "../config";
import { IaraSyncfusionInferenceBookmarksManager } from "../inferenceBookmarks";
import { IaraSyncfusionNavigationFieldManager } from "../navigationFields";
import { IaraSyncfusionSelectionManager } from "../selection";
import { IaraSyncfusionStyleManager } from "../style";
import { IaraSFDT, IaraSyncfusionContentReadManager } from "./read";

export class IaraSyncfusionContentWriteManager {
  private _selectionManager?: IaraSyncfusionSelectionManager;
  public preprocessAndInsertTemplate?: (
    template: unknown,
    metadata: unknown
  ) => Promise<void>;
  public selectedField: {
    content: string;
    title: string;
    type: "Field" | "Mandatory" | "Optional";
  } = { content: "", title: "", type: "Field" };

  constructor(
    private _editor: DocumentEditor,
    private _inferenceBookmarksManager: IaraSyncfusionInferenceBookmarksManager,
    private _inferenceFormatter: IaraEditorInferenceFormatter,
    private _navigationFieldManager: IaraSyncfusionNavigationFieldManager,
    private _readManager: IaraSyncfusionContentReadManager,
    private _recognition: IaraSpeechRecognition,
    private _styleManager: IaraSyncfusionStyleManager,
    private _config: IaraSyncfusionConfig
  ) {}

  private _formatSectionTitle(titleQueries: string[]): void {
    let matchedQuery = "";
    while (!matchedQuery && titleQueries.length) {
      const query = titleQueries.shift();
      if (!query) continue;

      this._editor.search.findAll(query);
      if (this._editor.search.searchResults.length) {
        matchedQuery = query;
        this._editor.selection.characterFormat.bold = true;
      }
    }

    this._editor.search.searchResults.clear();
  }

  private _handleFirstInference(inference: IaraSpeechRecognitionDetail): void {
    this._updateSelectedNavigationField(this._editor.selection.text);
    const hadSelectedText = this._editor.selection.text.length;

    if (hadSelectedText) this._editor.editor.delete();

    this._selectionManager = new IaraSyncfusionSelectionManager(
      this._editor,
      this._config,
      inference.inferenceId
        ? `inferenceId_${inference.inferenceId}`
        : undefined,
      this._config.highlightInference
    );

    this._inferenceBookmarksManager.addBookmark(
      inference,
      this._selectionManager.initialSelectionData.bookmarkId
    );

    if (this._selectionManager.wordBeforeSelection.endsWith(" ")) {
      // Removes trailing space so that the formatter can determine whether the space is required or not.
      // I.e. if the inference starts with a punctuation, there would be an extra space.
      this._selectionManager.moveSelectionToBeforeBookmarkEdge(
        this._selectionManager.initialSelectionData.bookmarkId
      );
      if (!hadSelectedText) {
        this._editor.selection.moveToPreviousCharacter();
        this._editor.selection.extendForward();
        this._editor.editor.delete();
        this._selectionManager.wordBeforeSelection =
          this._selectionManager.wordBeforeSelection.slice(0, -1);
      }
      this._selectionManager.resetSelection();
    }
  }

  private _handleTemplateOrPhraseInference(
    inference: IaraSpeechRecognitionDetail
  ): boolean {
    if (
      !inference.richTranscriptModifiers?.length ||
      !inference.richTranscriptWithoutModifiers
    )
      return false;

    const phraseOrTemplate =
      this._recognition.richTranscriptTemplates.templates[
        inference.richTranscriptModifiers[0]
      ];
    const metadata = phraseOrTemplate.metadata as { category?: string };

    const contentType = IaraSFDT.detectContentType(
      phraseOrTemplate.replaceText
    );

    // contentType equal plain_text the content is a phrase
    if (metadata.category === "Template" || contentType !== "plain_text") {
      const index: number | undefined =
        inference.richTranscriptWithoutModifiers.match(
          new RegExp(`iara texto ${inference.richTranscriptModifiers[0]}`, "ui")
        )?.index;

      const templatePrefix = inference.richTranscript
        .slice(0, index)
        .replace(/^<div>/, "");
      const template = inference.richTranscript
        .slice(index)
        .replace(/<\/div>$/, "");

      this.insertInference({
        ...inference,
        ...{ richTranscript: templatePrefix, richTranscriptModifiers: [] },
      });
      if (this.preprocessAndInsertTemplate)
        this.preprocessAndInsertTemplate?.(template, metadata);
      else this.insertTemplate(template, false);
      return true;
    }

    return false;
  }

  private _updateSelectedNavigationField(field: string): void {
    if (field.match(/\[(.*)\]/)) {
      const { title, content } =
        this._navigationFieldManager.getTitleAndContent(field);

      let type: "Field" | "Mandatory" | "Optional" = "Field";
      if (content.includes("*")) type = "Mandatory";
      if (content.includes("?")) type = "Optional";

      this.selectedField = {
        content,
        title,
        type,
      };
    } else this.selectedField = { content: "", title: "", type: "Field" };
  }

  insertParagraph(): void {
    this._editor.editor.insertText("\n");
  }

  async insertTemplate(
    content: string,
    replaceAllContent: boolean
  ): Promise<void> {
    const sfdt = await this._readManager.fromContent(content);
    if (replaceAllContent) this._editor.open(sfdt.value);
    else {
      this._editor.editor.paste(sfdt.value);
    }

    this._editor.selection.moveToDocumentStart();

    // Set the default editor format after inserting the template
    this._styleManager.setEditorDefaultFont({
      fontFamily: this._editor.selection.characterFormat.fontFamily,
      fontSize: this._editor.selection.characterFormat.fontSize,
      fontColor: this._config.darkMode ? "#fff" : "#000",
    });

    this._navigationFieldManager.createBookmarks();
    this._editor.selection.moveToDocumentEnd();
    if (this._navigationFieldManager.bookmarks.length)
      this._navigationFieldManager.nextField();
  }

  clear(): void {
    this._editor.enableTrackChanges = false;
    this._editor.selection?.selectAll();
    this._editor.editor?.delete();
    if (this._editor.editor) this._styleManager?.setEditorDefaultFont();
  }

  insertText(text: string): void {
    this._editor.editor.insertText(text);
  }

  insertInferenceText(text: string): void {
    const [firstLine, ...lines]: string[] = text.split("\n");
    this._editor.editor.insertText(firstLine);
    lines.forEach(line => {
      this.insertParagraph();
      line = line.trimStart();
      if (line) this._editor.editor.insertText(line);
    });
    if (lines.length) {
      const { endOffset } = this._editor.selection;
      this._selectionManager?.resetSelection();
      this._editor.selection.select(endOffset, endOffset);
    }
  }

  formatSectionTitles(): void {
    this._formatSectionTitle([
      "Técnica:",
      "Técnica de Exame:",
      "Técnica do Exame:",
    ]);
    this._formatSectionTitle(["Contraste:"]);
    this._formatSectionTitle([
      "Histórico Clínico:",
      "Indicação:",
      "Indicação Clínica:",
      "Informações Clínicas:",
    ]);
    this._formatSectionTitle(["Exames Anteriores:"]);
    this._formatSectionTitle([
      "Análise:",
      "Interpretação:",
      "Os seguintes aspectos foram observados:",
      "Relatório:",
    ]);
    this._formatSectionTitle(["Objetivo:"]);
    this._formatSectionTitle([
      "Conclusão:",
      "Hipótese Diagnóstica:",
      "Impressão Diagnóstica:",
      "Impressão:",
      "Resumo:",
      "Observação:",
      "Observações:",
      "Opinião:",
    ]);
    this._formatSectionTitle([
      "Achados:",
      "Achados Adicionais:",
      "Comparação:",
      "Demais Achados:",
      "Método:",
      "Protocolo:",
    ]);
  }

  formatTitle(): void {
    this._editor.selection.moveToDocumentEnd();
    const lastParagraph = parseInt(
      this._editor.selection.endOffset.split(";")[1]
    );
    this._editor.selection.moveToDocumentStart();

    let titleLine = "";
    let currentParagraph = 0;
    while (!titleLine && currentParagraph <= lastParagraph) {
      this._editor.selection.selectLine();
      titleLine = this._editor.selection.text.trim();
      currentParagraph++;
    }
    if (titleLine) {
      this._editor.selection.characterFormat.bold = true;
      this._editor.selection.characterFormat.allCaps = true;
      this._editor.selection.paragraphFormat.textAlignment = "Center";
    }
  }

  insertInference(inference: IaraSpeechRecognitionDetail): void {
    if (
      inference.transcript == "" ||
      (inference.richTranscriptModifiers?.length && !inference.isFinal)
    )
      return;

    if (inference.isFirst) {
      this._handleFirstInference(inference);
    } else if (this._selectionManager) {
      this._selectionManager.resetSelection(false);
    }

    if (!this._selectionManager) return;

    this._inferenceBookmarksManager.updateBookmarkInference(
      this._selectionManager.initialSelectionData.bookmarkId,
      inference
    );

    if (
      inference.richTranscriptModifiers?.length &&
      inference.richTranscriptWithoutModifiers
    ) {
      const insertedTemplate = this._handleTemplateOrPhraseInference(inference);
      if (insertedTemplate) return;
    }
    const text = this._inferenceFormatter.format(
      inference,
      this._selectionManager.wordBeforeSelection,
      this._selectionManager.wordAfterSelection,
      this._selectionManager.isAtStartOfLine
    );

    if (text.length) this.insertText(text);

    if (this._selectionManager.initialSelectionData.characterFormat.allCaps) {
      // Insert text is not respecting the allCaps property, work around that
      this._selectionManager.selectBookmark(
        this._selectionManager.initialSelectionData.bookmarkId
      );
      this._editor.selection.characterFormat.allCaps = true;
    }

    if (inference.isFinal) {
      if (text.length) {
        this._selectionManager.moveSelectionToAfterBookmarkEdge(
          this._selectionManager.initialSelectionData.bookmarkId
        );
      } else {
        this._selectionManager.selectBookmark(
          this._selectionManager.initialSelectionData.bookmarkId,
          false
        );
        this._editor.editor.delete();
      }
    }
  }
}
