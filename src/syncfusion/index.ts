import {
  CharacterFormatProperties,
  DocumentEditor,
  DocumentEditorContainer,
  Print,
} from "@syncfusion/ej2-documenteditor";
import { ListView, SelectedCollection } from "@syncfusion/ej2-lists";
import {
  Dialog,
  createSpinner,
  hideSpinner,
  showSpinner,
} from "@syncfusion/ej2-popups";
import { EditorAdapter, IaraEditorConfig } from "../editor";
import { IaraSpeechRecognition, IaraSpeechRecognitionDetail } from "../speech";
import { IaraSyncfusionEditorContentManager } from "./content";
import { IaraSyncfusionContextMenuManager } from "./contextMenu";
import { IaraSyncfusionNavigationFieldManager } from "./navigationFields/index";
import { IaraSyncfusionSelectionManager } from "./selection";
import { IaraSyncfusionShortcutsManager } from "./shortcuts";
import { IaraSyncfusionStyleManager } from "./style";
import { IaraSyncfusionToolbarManager } from "./toolbar";
import { IaraSyncfusionLanguageManager } from "./language";
import { IaraSyncfusionBookmarkManager } from "./bookmarks";

export interface IaraSyncfusionConfig extends IaraEditorConfig {
  replaceToolbar: boolean;
}

export class IaraSyncfusionAdapter
  extends EditorAdapter
  implements EditorAdapter
{
  private _contentManager: IaraSyncfusionEditorContentManager;
  private _contentDate?: Date;
  private _cursorSelection?: IaraSyncfusionSelectionManager;
  private _debouncedSaveReport: () => void;
  private _documentEditor: DocumentEditor;
  private _editorContainer?: DocumentEditorContainer;
  private _selectionManager?: IaraSyncfusionSelectionManager;
  private _inferenceEndOffset = "0;0;0";
  private _toolbarManager?: IaraSyncfusionToolbarManager;
  private _languageManager: IaraSyncfusionLanguageManager;
  private _bookmarkManager: IaraSyncfusionBookmarkManager;
  protected _navigationFieldManager: IaraSyncfusionNavigationFieldManager;

  protected static DefaultConfig: IaraSyncfusionConfig = {
    ...EditorAdapter.DefaultConfig,
    replaceToolbar: false,
  };
  protected _styleManager: IaraSyncfusionStyleManager;

  public savingReportSpan = document.createElement("span");
  public timeoutToSave: ReturnType<typeof setTimeout> | undefined;

  public get contentManager(): IaraSyncfusionEditorContentManager {
    return this._contentManager;
  }
  public get documentEditor(): DocumentEditor {
    return this._documentEditor;
  }

  public defaultFormat: CharacterFormatProperties = {};

  constructor(
    _editorInstance: DocumentEditorContainer | DocumentEditor,
    protected _recognition: IaraSpeechRecognition,
    protected _config: IaraSyncfusionConfig = IaraSyncfusionAdapter.DefaultConfig
  ) {
    super(_recognition, _config);

    if ("documentEditor" in _editorInstance) {
      this._editorContainer = _editorInstance;
      this._documentEditor = _editorInstance.documentEditor;
    } else {
      this._documentEditor = _editorInstance;
    }

    this._languageManager = new IaraSyncfusionLanguageManager(this._config);

    this._contentManager = new IaraSyncfusionEditorContentManager(
      this._documentEditor,
      this._recognition,
      () => (this._config.saveReport ? this._debouncedSaveReport() : undefined)
    );

    this._styleManager = new IaraSyncfusionStyleManager(
      this._documentEditor,
      this._config
    );

    this._navigationFieldManager = new IaraSyncfusionNavigationFieldManager(
      this._documentEditor,
      this._config,
      _recognition
    );

    this._bookmarkManager = new IaraSyncfusionBookmarkManager(
      this._documentEditor,
      this._config
    );

    if (this._config.replaceToolbar && this._editorContainer) {
      this._toolbarManager = new IaraSyncfusionToolbarManager(
        this._editorContainer,
        this._config,
        this._navigationFieldManager,
        this._languageManager
      );
      this._toolbarManager.init();
    }

    DocumentEditor.Inject(Print);

    this._documentEditor.enablePrint = true;
    this._documentEditor.enableImageResizer = true;

    this._debouncedSaveReport = this._debounce(this._saveReport.bind(this));

    this._documentEditor.addEventListener(
      "destroyed",
      this._onEditorDestroyed.bind(this)
    );

    new IaraSyncfusionShortcutsManager(
      this._documentEditor,
      _recognition,
      this.onTemplateSelectedAtShortCut.bind(this),
      this._navigationFieldManager
    );

    new IaraSyncfusionContextMenuManager(
      this._documentEditor,
      this._navigationFieldManager,
      this._languageManager
    );

    createSpinner({
      target: this._documentEditor.editor.documentHelper.viewerContainer,
    });

    this._setScrollClickHandler();
  }

  blockEditorWhileSpeaking(status: boolean): void {
    const wrapper = document.getElementById("iara-syncfusion-editor-container");
    if (wrapper) wrapper.style.cursor = status ? "not-allowed" : "auto";
  }

  async copyReport(): Promise<string[]> {
    this._documentEditor.revisions.acceptAll();
    this._documentEditor.enableTrackChanges = false;

    this._documentEditor.focusIn();
    this._documentEditor.selection.selectAll();

    this.showSpinner();
    try {
      const content = await this._contentManager.getContent();

      // By pretending our html comes from google docs, we can paste it into
      // tinymce without losing the formatting for some reason.
      const htmlContent = content[1].replace(
        '<div class="Section0">',
        '<div class="Section0" id="docs-internal-guid-iara">'
      );
      console.log("copyReport", content[0], htmlContent, content[2]);
      this._recognition.automation.copyText(
        content[0],
        htmlContent,
        content[2]
      );
      this.hideSpinner();
      this._documentEditor.selection.moveNextPosition();

      return content.slice(0, 3);
    } catch (error) {
      this.hideSpinner();
      this._documentEditor.selection.moveToDocumentStart();
      throw error;
    }
  }

  clearReport(): void {
    this._documentEditor.enableTrackChanges = false;
    this._documentEditor.selection?.selectAll();
    this._documentEditor.editor?.delete();
    if (this._documentEditor.editor) this._styleManager?.setEditorDefaultFont();
  }

  getEditorContent(): Promise<[string, string, string, string]> {
    return this._contentManager.getContent();
  }

  private _formatSectionTitle(titleQueries: string[]): void {
    let matchedQuery = "";
    while (!matchedQuery && titleQueries.length) {
      const query = titleQueries.shift();
      if (!query) continue;

      this._documentEditor.search.findAll(query);
      if (this._documentEditor.search.searchResults.length) {
        matchedQuery = query;
        this._documentEditor.selection.characterFormat.bold = true;
      }
    }

    this._documentEditor.search.searchResults.clear();
  }

  formatSectionTitles(): void {
    this._formatSectionTitle(["Técnica:", "Técnica de Exame:"]);
    this._formatSectionTitle(["Contraste:"]);
    this._formatSectionTitle([
      "Histórico Clínico:",
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
    this._documentEditor.selection.moveToDocumentEnd();
    const lastParagraph = parseInt(
      this._documentEditor.selection.endOffset.split(";")[1]
    );
    this._documentEditor.selection.moveToDocumentStart();

    let titleLine = "";
    let currentParagraph = 0;
    while (!titleLine && currentParagraph <= lastParagraph) {
      this._documentEditor.selection.selectLine();
      titleLine = this._documentEditor.selection.text.trim();
      currentParagraph++;
    }
    if (titleLine) {
      this._documentEditor.selection.characterFormat.bold = true;
      this._documentEditor.selection.characterFormat.allCaps = true;
      this._documentEditor.selection.paragraphFormat.textAlignment = "Center";
    }
  }

  hideSpinner(): void {
    hideSpinner(this._documentEditor.editor.documentHelper.viewerContainer);
  }

  insertParagraph(setStyle = false): void {
    this._documentEditor.editor.insertText("\n");
    if (setStyle) this._inferencehighlightColor();
  }

  async insertTemplate(
    content: string,
    replaceAllContent = false
  ): Promise<void> {
    console.log("insertTemplate0", content, replaceAllContent);
    const sfdt = await this.contentManager.fromContent(content);
    if (replaceAllContent) this._documentEditor.open(sfdt.value);
    else {
      this._documentEditor.editor.paste(sfdt.value);
      this._documentEditor.editor.onBackSpace();
    }
    console.log("insertTemplate1", sfdt.value);

    this._documentEditor.selection.moveToDocumentStart();

    console.log(
      "insertTemplate2",
      this._documentEditor.selection.characterFormat.fontFamily,
      this._documentEditor.selection.characterFormat.fontSize
    );
    // Set the default editor format after inserting the template
    this._documentEditor?.setDefaultCharacterFormat({
      fontFamily: this._documentEditor.selection.characterFormat.fontFamily,
      fontSize: this._documentEditor.selection.characterFormat.fontSize,
    });

    this._navigationFieldManager.getBookmarks();
    this._documentEditor.selection.moveToDocumentEnd();
    this._navigationFieldManager.nextField();
  }

  insertText(text: string): void {
    const [firstLine, ...lines]: string[] = text.split("\n");
    this._documentEditor.editor.insertText(firstLine);
    lines.forEach(line => {
      this.insertParagraph(true);
      line = line.trimStart();
      if (line) this._documentEditor.editor.insertText(line);
    });
  }

  insertInference(inference: IaraSpeechRecognitionDetail): void {
    if (inference.transcript == "") return;

    if (inference.richTranscriptModifiers?.length && !inference.isFinal) return;

    if (inference.isFirst) {
      this._handleFirstInference();
    } else if (this._selectionManager) {
      let initialStartOffset =
        this._selectionManager.initialSelectionData.startOffset;

      if (this._selectionManager.isAtStartOfLine) {
        if (initialStartOffset.split(";")[2] === "0") {
          initialStartOffset = `${initialStartOffset.split(";")[0]};${
            initialStartOffset.split(";")[1]
          };1`;
        }
      }

      this._documentEditor.selection.select(
        initialStartOffset,
        this._inferenceEndOffset
      );
    }

    this._bookmarkManager.insertInferenceField(
      inference.isFirst,
      inference.isFinal
    );

    if (!this._selectionManager) return;

    if (
      inference.richTranscriptModifiers?.length &&
      inference.richTranscriptWithoutModifiers
    ) {
      const insertedTemplate = this._handleTemplateInference(inference);
      if (insertedTemplate) return;
    }
    const text = this._inferenceFormatter.format(
      inference,
      this._selectionManager.wordBeforeSelection,
      this._selectionManager.wordAfterSelection,
      this._selectionManager.isAtStartOfLine
    );

    if (text.length) this.insertText(text);
    else this._documentEditor.editor.delete();

    this._inferenceEndOffset = this._documentEditor.selection.endOffset;

    if (inference.isFinal) this._selectionManager = undefined;
  }

  moveToDocumentEnd() {
    this._documentEditor.selection.moveToDocumentEnd();
  }

  undo(): void {
    this._documentEditor.editorHistory.undo();
  }

  private _debounce(func: () => unknown) {
    let timer: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func();
      }, 1000);
    };
  }

  private async _saveReport(): Promise<void> {
    if (this._documentEditor.isDocumentEmpty) return;
    if (!this._recognition.report["_key"]) await this._beginReport();

    let spanContent = "";
    try {
      const contentDate = new Date();
      this._contentDate = contentDate;

      const content: string[] = await this._contentManager.getContent();
      const element = document.querySelector(".e-de-status-bar");

      if (element) {
        this.savingReportSpan.style.width = "120px";
        this.savingReportSpan.style.margin = "10px";
        this.savingReportSpan.style.fontSize = "12px";
        this.savingReportSpan.style.color = "black";
        spanContent =
          this._languageManager.languages.language.iaraTranslate.saveMessage
            .loading;
        this.savingReportSpan.innerHTML = `<span class="e-icons e-refresh-2" style="margin-right: 4px"></span>${spanContent}`;
        element.insertBefore(this.savingReportSpan, element.firstChild);
      }

      if (contentDate !== this._contentDate) return;

      await this._updateReport(content[0], content[1]);
      spanContent =
        this._languageManager.languages.language.iaraTranslate.saveMessage
          .success;
      this.savingReportSpan.innerHTML = `<span class="e-icons e-check" style="margin-right: 4px; color: #b71c1c"></span>${spanContent}`;
    } catch {
      spanContent =
        this._languageManager.languages.language.iaraTranslate.saveMessage
          .error;
      this.savingReportSpan.innerHTML = `<span class="e-icons e-warning" style="margin-right: 4px; color: #ffb300"></span>${spanContent}`;
    }
  }

  onTemplateSelectedAtShortCut(
    listViewInstance: ListView,
    dialogObj: Dialog
  ): void {
    ["click", "keyup"].forEach(event => {
      document.getElementById("listview")?.addEventListener(event, e => {
        const click = e as PointerEvent;
        const keyup = e as KeyboardEvent;
        if (keyup.key === "Enter" || click.pointerType === "mouse") {
          const selecteditem: SelectedCollection =
            listViewInstance.getSelectedItems() as SelectedCollection;
          const item = selecteditem.data as unknown as {
            name: string;
            category: string;
            content: string;
          };
          this.undo();

          if (item.category === "Template") this.insertTemplate(item.content);
          else this.insertText(item.content);

          dialogObj.hide();
        }
      });
    });
  }

  print(): void {
    if (this._config.darkMode) this._styleManager.setEditorFontColor("#000");
    this._documentEditor.print();
    if (this._config.darkMode) this._styleManager.setEditorFontColor("#fff");
  }

  replaceParagraph(
    sectionIndex: number,
    paragraphIndex: number,
    content: string
  ) {
    this._documentEditor.selection.select(
      `${sectionIndex};${paragraphIndex};0`,
      `${sectionIndex};${paragraphIndex};0`
    );

    this._documentEditor.selection.extendToParagraphEnd();
    this.insertText(content);
  }

  showSpinner(): void {
    showSpinner(this._documentEditor.editor.documentHelper.viewerContainer);
  }

  private _setScrollClickHandler() {
    this._documentEditor
      .getRootElement()
      .addEventListener("mousedown", event => {
        if (event.button === 1) {
          this._cursorSelection = new IaraSyncfusionSelectionManager(
            this._documentEditor,
            false
          );
        }
      });

    this._documentEditor.getRootElement().addEventListener("mouseup", event => {
      if (event.button === 1) {
        this._cursorSelection?.resetSelection();
        this._cursorSelection = undefined;

        this._recognition.toggleRecording();
      }
    });
  }

  private _getCurrrentNavigateFieldSelected(field: string): void {
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

  private _handleFirstInference(): void {
    this._getCurrrentNavigateFieldSelected(this._documentEditor.selection.text);

    if (this._documentEditor.selection.text.length) {
      this._documentEditor.editor.delete();
    }
    this._selectionManager = new IaraSyncfusionSelectionManager(
      this._documentEditor
    );

    if (this._selectionManager.wordBeforeSelection.endsWith(" ")) {
      this._documentEditor.selection.extendBackward();
      this._documentEditor.editor.delete();
      this._selectionManager = new IaraSyncfusionSelectionManager(
        this._documentEditor
      );
    }
  }

  private _handleTemplateInference(
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
    if (metadata.category === "Template" || !metadata.category) {
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
      this.insertTemplate(template);

      return true;
    }

    return false;
  }

  private _inferencehighlightColor(): void {
    if (this._config.highlightInference) {
      this._config.darkMode
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          (this._documentEditor.selection.characterFormat.highlightColor =
            "#0e5836")
        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          (this._documentEditor.selection.characterFormat.highlightColor =
            "#ccffe5");
    }
  }
}
