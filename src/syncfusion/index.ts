import type { Editor, EditorHistory } from "@syncfusion/ej2-documenteditor";

import { EditorAdapter } from "../editor";
import { IaraInference } from "../speech";

export class IaraSyncfusionAdapter
  extends EditorAdapter
  implements EditorAdapter
{
  private _initialUndoStackSize = 0;
  public spanSavingEditor = document.createElement("span");
  public timeoutToSave: string | number | NodeJS.Timeout | undefined;
  private get _editorAPI(): Editor {
    return this._editor.editor;
  }

  private get _editorHistory(): EditorHistory {
    return this._editor.editorHistory;
  }

  constructor(protected _editor: any, protected _recognition: any) {
    super(_editor, _recognition);
    this._editor.contentChange = this._onContentChange.bind(this);
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

  insertInference(inference: IaraInference) {
    if (inference.isFirst) {
      this._initialUndoStackSize = this.getUndoStackSize();
    } else {
      const undoStackSize = this.getUndoStackSize();
      for (let i = 0; i < undoStackSize - this._initialUndoStackSize; i++)
        this.undo();
    }

    const text = inference.richTranscript
      .replace(/^<div>/, "")
      .replace(/<\/div>$/, "");
    const [firstLine, ...lines]: string[] = text.split("</div><div>");

    this.insertText(firstLine);

    lines.forEach(line => {
      this.insertParagraph();
      line = line.trim();
      if (line) this.insertText(line);
    });
  }

  private async _onContentChange() {
    const element = document.getElementById(
      "iara-syncfusion-editor-container_editor"
    );
    if (element) {
      this.spanSavingEditor.style.margin = "10px";
      this.spanSavingEditor.style.fontSize = "14px";
      this.spanSavingEditor.style.display = "flex";
      this.spanSavingEditor.style.justifyContent = "end";
      this.spanSavingEditor.innerText = "Salvando...";
      element.appendChild(this.spanSavingEditor);
    }
    let contentText = await this._editor
      .saveAsBlob("Txt")
      .then(async (blob: Blob) => {
        return await blob.text();
      });
    let contentSfdt = await this._editor
      .saveAsBlob("Sfdt")
      .then(async (blob: Blob) => {
        return await blob.text();
      });

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
    const htmlContent = await response;
    const html = await htmlContent.json();

    this._debounceToSave(() => this._onReportChanged(contentText, html.html));
  }

  private _debounceToSave = (func: () => void) => {
    if (!this.timeoutToSave) {
      func();
    }
    clearTimeout(this.timeoutToSave);
    this.timeoutToSave = setTimeout(() => {
      this.timeoutToSave = undefined;
      this.spanSavingEditor.innerText = "Salvo";
    }, 3000);
  };

  undo() {
    this._editorHistory.undo();
  }
}
