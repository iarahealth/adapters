import type {
  Editor,
  EditorHistory,
  Selection,
} from "@syncfusion/ej2-documenteditor";
import { EditorAdapter } from "../editor";
import { IaraInference } from "../speech";
import { IaraEditorInferenceFormatter } from "../editor/formatter";
import { toolBarSettings, toolbarButtonClick } from "./toolbarConfig";

interface SelectionOffsets {
  end: string;
  start: string;
}

export class IaraSyncfusionAdapter
  extends EditorAdapter
  implements EditorAdapter
{
  private _initialUndoStackSize = 0;

  private _inferenceFormatter: IaraEditorInferenceFormatter;

  public savingReportSpan = document.createElement("span");
  public timeoutToSave: any;

  private get _toolBar() {
    return this._editor.toolbarModule.toolbar;
  }

  private get _editorAPI(): Editor {
    return this._editor.documentEditor.editor;
  }
  private get _editorHistory(): EditorHistory {
    return this._editor.documentEditor.editorHistory;
  }

  private get _editorSelection(): Selection {
    return this._editor.selection;
  }

  constructor(protected _editor: any, protected _recognition: any) {
    super(_editor, _recognition);
    this._editor.contentChange = this._onContentChange.bind(this);
    this._editor.destroyed = this._onEditorDestroy.bind(this);
    this._editor.enableLocalPaste = true;
    this.initToolbarConfigs();
    this._inferenceFormatter = new IaraEditorInferenceFormatter();
  }

  getUndoStackSize(): number {
    return this._editorHistory.undoStack?.length || 0;
  }

  insertParagraph() {
    this._editorAPI.insertText("\n");
  }

  insertText(text: string) {
    this._editorAPI.insertText(text);
  }

  async sfdtToHtml(content: string) {
    const endpoint =
      "https://api.iarahealth.com/speech/syncfusion/sfdt_to_html/";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this._recognition.internal.iaraAPIMandatoryHeaders,
      },
      body: JSON.stringify({ sfdt: content }),
    }).then(async response => await response.json());

    return response;
  }

  async htmlToSfdt(content: string) {
    const endpoint =
      "https://api.iarahealth.com/speech/syncfusion/html_to_sfdt/";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this._recognition.internal.iaraAPIMandatoryHeaders,
      },
      body: JSON.stringify({ html: content }),
    }).then(async response => await response.json());

    return response;
  }

  async insertTemplate(template: string) {
    const response = await this.htmlToSfdt(template);
    this._editor.open(response);
  }

  async getEditorContent() {
    const contentSfdt = await this._editor
      .saveAsBlob("Sfdt")
      .then((blob: Blob) => blob.text());

    const response = fetch(
      "https://api.iarahealth.com/speech/syncfusion/sfdt_to_html/",
      {
        headers: {
          "Content-Type": "application/json",
          ...this._recognition.internal.iaraAPIMandatoryHeaders,
        },
        method: "POST",
        body: contentSfdt,
      }
    );
    const htmlContent = await response.then(response => response.json());
    return htmlContent.html;
  }

  private _getWordAfterSelection(selectionOffsets: SelectionOffsets): string {
    this._editorSelection.extendToWordEnd();
    const wordAfter = this._editorSelection.text.trimEnd();
    this._editorSelection.select(selectionOffsets.start, selectionOffsets.end);
    return wordAfter;
  }

  private _getWordBeforeSelection(selectionOffsets: SelectionOffsets): string {
    this._editorSelection.extendToWordStart();
    const wordBefore = this._editorSelection.text.trimStart();
    this._editorSelection.select(selectionOffsets.start, selectionOffsets.end);
    return wordBefore;
  }

  insertInference(inference: IaraInference) {
    if (inference.isFirst) {
      if (this._editorSelection.text.length) this._editorAPI.delete();
      this._initialUndoStackSize = this.getUndoStackSize();
    } else {
      const undoStackSize = this.getUndoStackSize();
      for (let i = 0; i < undoStackSize - this._initialUndoStackSize; i++)
        this.undo();
    }

    // Syncfusion formatter
    let text = inference.richTranscript
      .replace(/^<div>/, "")
      .replace(/<\/div>$/, "");

    const initialSelectionOffsets = {
      end: this._editorSelection.endOffset,
      start: this._editorSelection.startOffset,
    };
    const wordBefore = this._getWordBeforeSelection(initialSelectionOffsets);
    const wordAfter = this._getWordAfterSelection(initialSelectionOffsets);

    text = this._inferenceFormatter.format(inference, wordBefore, wordAfter);

    const [firstLine, ...lines]: string[] = text.split("</div><div>");
    this.insertText(firstLine);

    lines.forEach(line => {
      this.insertParagraph();
      line = line.trimStart();
      if (line) this.insertText(line);
    });
  }

  initToolbarConfigs() {
    const toolbarItems = toolBarSettings(this._editor);
    this._toolBar.addItems(toolbarItems, 5);
    this._editor.toolbarClick = this.onClickToolbar.bind(this);
    this.removePropertiesPane();
  }

  onClickToolbar(arg: { item: any }) {
    toolbarButtonClick(arg, this._editorAPI, this._editor);
  }

  removePropertiesPane() {
    this._editor.showPropertiesPane = false;
    const paneButton = document.querySelector(
      ".e-de-ctnr-properties-pane-btn"
    ) as HTMLElement;
    paneButton.remove();
    //remove wrapper button
    const wrapper = document.querySelector(".e-de-tlbr-wrapper") as HTMLElement;
    wrapper.style.width = "100%";
  }

  private async _onEditorDestroy() {
    this.finishReport();
  }

  private async _onContentChange() {
    const element = document.getElementById(
      "iara-syncfusion-editor-container_editor"
    );
    if (element) {
      this.savingReportSpan.style.margin = "10px";
      this.savingReportSpan.style.fontSize = "14px";
      this.savingReportSpan.style.display = "flex";
      this.savingReportSpan.style.justifyContent = "end";
      this.savingReportSpan.style.color = "black";
      this.savingReportSpan.innerText = "Salvando...";
      element.appendChild(this.savingReportSpan);
    }
    const contentText = await this._editor
      .saveAsBlob("Txt")
      .then((blob: Blob) => blob.text());

    const contentHTML = await this.getEditorContent();

    this._debounceToSave(() => this._onReportChanged(contentText, contentHTML));
  }

  private _debounceToSave = (func: () => void) => {
    if (!this.timeoutToSave) {
      func();
    }
    clearTimeout(this.timeoutToSave);
    this.timeoutToSave = setTimeout(() => {
      this.timeoutToSave = undefined;
      this.savingReportSpan.innerText = "Salvo";
    }, 3000);
  };

  blockEditorWhileSpeaking(status: boolean) {
    const wrapper = document.getElementById("iara-syncfusion-editor-container");
    if (wrapper)
      status
        ? (wrapper.style.cursor = "not-allowed")
        : (wrapper.style.cursor = "auto");
  }

  undo() {
    this._editorHistory.undo();
  }

  copyReport(): void {
    this._editorSelection.selectAll();
    this._editorSelection.copySelectedContent(false);
  }

  clearReport(): void {
    this._editorSelection.selectAll();
    this._editorAPI.delete();
  }

  setEditorFontFamily(fontFamily: string): void {
    this._editorSelection.characterFormat.fontFamily = fontFamily;
    this._editor.focusIn();
  }

  setEditorFontSize(fontSize: number): void {
    this._editorSelection.characterFormat.fontSize = fontSize;
    this._editor.focusIn();
  }

  editorToggleBold(): void {
    this._editorAPI.toggleBold();
  }

  editorToggleItalic(): void {
    this._editorAPI.toggleItalic();
  }

  editorToggleUnderline(): void {
    this._editorAPI.toggleUnderline("Single");
  }

  editorToggleUppercase(): void {
    throw new Error("Método não implementado.");
  }
}
