import type {
  Editor,
  EditorHistory,
  Selection,
} from "@syncfusion/ej2-documenteditor";
import { EditorAdapter } from "../editor";
import { IaraInference } from "../speech";
import { IaraSyncfusionInferenceFormatter } from "./formatter";

export class IaraSyncfusionAdapter
  extends EditorAdapter
  implements EditorAdapter
{
  private _initialUndoStackSize = 0;
  public savingReportSpan = document.createElement("span");
  public timeoutToSave: string | number | NodeJS.Timeout | undefined;
  private _inferenceFormatter: IaraSyncfusionInferenceFormatter;

  private get _editorAPI(): Editor {
    return this._editor.editor;
  }
  private get _editorHistory(): EditorHistory {
    return this._editor.editorHistory;
  }
  private get _editorSelection(): Selection {
    return this._editor.selection;
  }

  constructor(protected _editor: any, protected _recognition: any) {
    super(_editor, _recognition);
    this._editor.contentChange = this._onContentChange.bind(this);
    this._inferenceFormatter = new IaraSyncfusionInferenceFormatter(
      this._editorSelection
    );
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
    let endpoint = 'https://api.iarahealth.com/speech/syncfusion/sfdt_to_html/';

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this._recognition.internal.iaraAPIMandatoryHeaders,
        },
        body: JSON.stringify({ sfdt: content }),
      })
      .then(async (response) => await response.json());

    return response;
  }

  async htmlToSfdt(content: string) {
    let endpoint = 'https://api.iarahealth.com/speech/syncfusion/html_to_sfdt/';

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this._recognition.internal.iaraAPIMandatoryHeaders,
        },
        body: JSON.stringify({ html: content }),
      })
      .then(async (response) => await response.json());

    return response;
  }

  async insertTemplate(template: string) {
    const response = await this.htmlToSfdt(template);
    this._editor.open(response);
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

    const text = this._inferenceFormatter.format(inference);

    const [firstLine, ...lines]: string[] = text.split("</div><div>");
    this.insertText(firstLine);

    lines.forEach(line => {
      this.insertParagraph();
      line = line.trimStart();
      if (line) this.insertText(line);
    });
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
      this.savingReportSpan.innerText = "Salvando...";
      element.appendChild(this.savingReportSpan);
    }
    const contentText = await this._editor
      .saveAsBlob("Txt")
      .then((blob: Blob) => blob.text());

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

    this._debounceToSave(() =>
      this._onReportChanged(contentText, htmlContent.html)
    );
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
}
