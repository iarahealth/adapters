import type { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import {
  CharacterFormatProperties,
  DocumentEditor,
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
import { IaraSFDT, IaraSyncfusionEditorContentManager } from "./content";
import { IaraSyncfusionSelectionManager } from "./selection";
import { IaraSyncfusionShortcutsManager } from "./shortcuts";
import { IaraSyncfusionStyleManager } from "./style";
import { IaraSyncfusionToolbarManager } from "./toolbar";

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
  private _selectionManager?: IaraSyncfusionSelectionManager;
  private _inferenceEndOffset = "0;0;0";
  private _toolbarManager?: IaraSyncfusionToolbarManager;

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

  public defaultFormat: CharacterFormatProperties = {};

  constructor(
    protected _editorContainer: DocumentEditorContainer,
    protected _recognition: IaraSpeechRecognition,
    protected _config: IaraSyncfusionConfig = IaraSyncfusionAdapter.DefaultConfig
  ) {
    super(_editorContainer, _recognition, _config);

    this._contentManager = new IaraSyncfusionEditorContentManager(
      _editorContainer.documentEditor,
      _recognition,
      () => (this._config.saveReport ? this._debouncedSaveReport() : undefined)
    );

    new IaraSyncfusionShortcutsManager(
      _editorContainer.documentEditor,
      _recognition,
      this.onTemplateSelectedAtShortCut.bind(this)
    );

    this._styleManager = new IaraSyncfusionStyleManager(
      _editorContainer.documentEditor,
      this._config
    );

    if (this._config.replaceToolbar) {
      this._toolbarManager = new IaraSyncfusionToolbarManager(
        _editorContainer,
        this._config
      );
      this._toolbarManager.init();
    }

    DocumentEditor.Inject(Print);
    this._editorContainer.documentEditor.enablePrint = true;

    this._editorContainer.documentEditor.enableImageResizer = true;

    this._debouncedSaveReport = this._debounce(this._saveReport.bind(this));

    this._editorContainer.addEventListener(
      "destroyed",
      this._onEditorDestroyed.bind(this)
    );

    createSpinner({
      target: _editorContainer.editorContainer,
    });

    this._setScrollClickHandler();
  }

  blockEditorWhileSpeaking(status: boolean): void {
    const wrapper = document.getElementById("iara-syncfusion-editor-container");
    if (wrapper) wrapper.style.cursor = status ? "not-allowed" : "auto";
  }

  async copyReport(): Promise<void> {
    this._editorContainer.documentEditor.focusIn();
    this._editorContainer.documentEditor.selection.selectAll();
    showSpinner(this._editorContainer.editorContainer);
    const content = await this._contentManager.getContent();

    // By pretending our html comes from google docs, we can paste it into
    // tinymce without losing the formatting for some reason.
    const htmlContent = content[1].replace(
      '<div class="Section0">',
      '<div class="Section0" id="docs-internal-guid-iara">'
    );
    this._recognition.automation.copyText(content[0], htmlContent, content[2]);
    hideSpinner(this._editorContainer.editorContainer);
    this._editorContainer.documentEditor.selection.moveNextPosition();
  }

  clearReport(): void {
    this._editorContainer.documentEditor.selection.selectAll();
    this._editorContainer.documentEditor.editor.delete();
  }

  getEditorContent(): Promise<[string, string, string, string]> {
    return this._contentManager.getContent();
  }

  insertParagraph(): void {
    this._editorContainer.documentEditor.editor.insertText("\n");
  }

  async insertTemplate(
    content: string,
    replaceAllContent = false
  ): Promise<void> {
    const sfdt = await IaraSFDT.fromContent(
      content,
      this._recognition.internal.iaraAPIMandatoryHeaders as HeadersInit
    );
    if (replaceAllContent)
      this._editorContainer.documentEditor.open(sfdt.value);
    else this._editorContainer.documentEditor.editor.paste(sfdt.value);

    this._editorContainer.documentEditor.selection.moveToDocumentStart();

    // Set the default editor format after inserting the template
    this._editorContainer.documentEditor.setDefaultCharacterFormat({
      fontFamily:
        this._editorContainer.documentEditor.selection.characterFormat
          .fontFamily,
      fontSize:
        this._editorContainer.documentEditor.selection.characterFormat.fontSize,
    });

    this._editorContainer.documentEditor.selection.moveToDocumentEnd();
  }

  insertText(text: string): void {
    this._editorContainer.documentEditor.editor.insertText(text);
  }

  insertInference(inference: IaraSpeechRecognitionDetail): void {
    if (inference.transcript == "") return;

    if (inference.richTranscriptModifiers?.length && !inference.isFinal) return;

    if (inference.isFirst) {
      this._handleFirstInference();
    } else if (this._selectionManager) {
      this._editorContainer.documentEditor.selection.select(
        this._selectionManager.initialSelectionData.startOffset,
        this._inferenceEndOffset
      );
    }
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

    if (text.length) {
      const [firstLine, ...lines]: string[] = text.split("\n");
      this.insertText(firstLine);
      lines.forEach(line => {
        this.insertParagraph();
        line = line.trimStart();
        if (line) this.insertText(line);
      });
    } else this._editorContainer.documentEditor.editor.delete();

    this._inferenceEndOffset =
      this._editorContainer.documentEditor.selection.endOffset;

    if (inference.isFinal) this._selectionManager = undefined;
  }

  undo(): void {
    this._editorContainer.documentEditor.editorHistory.undo();
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
    const contentDate = new Date();
    this._contentDate = contentDate;

    const element = document.querySelector(".e-de-status-bar");
    if (element) {
      this.savingReportSpan.style.margin = "10px";
      this.savingReportSpan.style.fontSize = "12px";
      this.savingReportSpan.style.display = "flex";
      this.savingReportSpan.style.justifyContent = "end";
      this.savingReportSpan.style.color = "black";
      this.savingReportSpan.innerText = "Salvando...";
      element.insertBefore(this.savingReportSpan, element.firstChild);
    }

    const content: string[] = await Promise.all([
      this._contentManager.getPlainTextContent(),
      this._contentManager.getHtmlContent(),
    ]);

    if (contentDate !== this._contentDate) return;

    await this._updateReport(content[0], content[1]);
    this.savingReportSpan.innerText = "Salvo";
  }

  onTemplateSelectedAtShortCut(
    listViewInstance: ListView,
    dialogObj: Dialog
  ): void {
    document.getElementById("listview")?.addEventListener("click", () => {
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
    });
  }

  print(): void {
    if (this._config.darkMode) this._styleManager.setEditorFontColor("#000");
    this._editorContainer.documentEditor.print();
    if (this._config.darkMode) this._styleManager.setEditorFontColor("#fff");
  }

  replaceParagraph(
    sectionIndex: number,
    paragraphIndex: number,
    content: string
  ) {
    this._editorContainer.documentEditor.selection.select(
      `${sectionIndex};${paragraphIndex};0`,
      `${sectionIndex};${paragraphIndex};0`
    );

    this._editorContainer.documentEditor.selection.extendToParagraphEnd();
    this.insertText(content);
  }

  private _setScrollClickHandler() {
    this._editorContainer.element.addEventListener("mousedown", event => {
      if (event.button === 1) {
        this._cursorSelection = new IaraSyncfusionSelectionManager(
          this._editorContainer.documentEditor,
          false
        );
      }
    });

    this._editorContainer.element.addEventListener("mouseup", event => {
      if (event.button === 1) {
        this._cursorSelection?.resetSelection();
        this._cursorSelection = undefined;

        this._recognition.toggleRecording();
      }
    });
  }

  private _handleFirstInference(): void {
    if (this._editorContainer.documentEditor.selection.text.length) {
      this._editorContainer.documentEditor.editor.delete();
    }
    this._selectionManager = new IaraSyncfusionSelectionManager(
      this._editorContainer.documentEditor
    );

    if (this._selectionManager.wordBeforeSelection.endsWith(" ")) {
      this._editorContainer.documentEditor.selection.extendBackward();
      this._editorContainer.documentEditor.editor.delete();
      this._selectionManager = new IaraSyncfusionSelectionManager(
        this._editorContainer.documentEditor
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
}
