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

    this._contentManager = new IaraSyncfusionEditorContentManager(
      this._documentEditor,
      _recognition,
      () => (this._config.saveReport ? this._debouncedSaveReport() : undefined)
    );

    this._styleManager = new IaraSyncfusionStyleManager(
      this._documentEditor,
      this._config
    );

    if (this._config.replaceToolbar && this._editorContainer) {
      this._toolbarManager = new IaraSyncfusionToolbarManager(
        this._editorContainer,
        this._config
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

    this._navigationFieldManager = new IaraSyncfusionNavigationFieldManager(
      this._documentEditor
    );

    new IaraSyncfusionShortcutsManager(
      this._documentEditor,
      _recognition,
      this.onTemplateSelectedAtShortCut.bind(this),
      this._navigationFieldManager
    );

    new IaraSyncfusionContextMenuManager(
      this._documentEditor,
      this._navigationFieldManager
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
    this._documentEditor.focusIn();
    this._documentEditor.selection.selectAll();

    showSpinner(this._documentEditor.editor.documentHelper.viewerContainer);
    const content = await this._contentManager.getContent();

    // By pretending our html comes from google docs, we can paste it into
    // tinymce without losing the formatting for some reason.
    const htmlContent = content[1].replace(
      '<div class="Section0">',
      '<div class="Section0" id="docs-internal-guid-iara">'
    );
    console.log("copyReport", content[0], htmlContent, content[2]);
    this._recognition.automation.copyText(content[0], htmlContent, content[2]);
    hideSpinner(this._documentEditor.editor.documentHelper.viewerContainer);
    this._documentEditor.selection.moveNextPosition();

    return content.slice(0, 3);
  }

  clearReport(): void {
    this._documentEditor.selection.selectAll();
    this._documentEditor.editor.delete();
    this._styleManager.setEditorDefaultFont();
  }

  getEditorContent(): Promise<[string, string, string, string]> {
    return this._contentManager.getContent();
  }

  insertParagraph(): void {
    this._documentEditor.editor.insertText("\n");
  }

  async insertTemplate(
    content: string,
    replaceAllContent = false
  ): Promise<void> {
    console.log("insertTemplate0", content, replaceAllContent);
    const sfdt = await this.contentManager.fromContent(content);
    if (replaceAllContent) this._documentEditor.open(sfdt.value);
    else this._documentEditor.editor.paste(sfdt.value);
    console.log("insertTemplate1", sfdt.value);

    this._documentEditor.selection.moveToDocumentStart();

    console.log(
      "insertTemplate2",
      this._documentEditor.selection.characterFormat.fontFamily,
      this._documentEditor.selection.characterFormat.fontSize
    );
    // Set the default editor format after inserting the template
    this._documentEditor.setDefaultCharacterFormat({
      fontFamily: this._documentEditor.selection.characterFormat.fontFamily,
      fontSize: this._documentEditor.selection.characterFormat.fontSize,
    });

    this._documentEditor.selection.moveToDocumentEnd();
    this._navigationFieldManager.getBookmarks();
  }

  insertText(text: string): void {
    this._documentEditor.editor.insertText(text);
  }

  insertInference(inference: IaraSpeechRecognitionDetail): void {
    if (inference.transcript == "") return;

    if (inference.richTranscriptModifiers?.length && !inference.isFinal) return;

    if (inference.isFirst) {
      this._handleFirstInference();
    } else if (this._selectionManager) {
      this._documentEditor.selection.select(
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
    } else this._documentEditor.editor.delete();

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

    const content: string[] = await this._contentManager.getContent();

    if (contentDate !== this._contentDate) return;
    if (!this._recognition.report["_key"]) {
      await this.beginReport();
    }
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

  private _handleFirstInference(): void {
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
}
