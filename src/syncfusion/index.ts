import type { Editor, EditorHistory } from "@syncfusion/ej2-documenteditor";
import { EditorAdapter } from "../editor";
import { IaraInference } from "../speech";

export class IaraSyncfusionAdapter
  extends EditorAdapter
  implements EditorAdapter
{
  private _initialUndoStackSize = 0;

  private get _editorAPI(): Editor {
    return this._editor.editor;
  }

  private get _editorHistory(): EditorHistory {
    return this._editor.editorHistory;
  }

  private get _recognitionInternal(): any {
    return this._recognition.internal;
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

  async converter(template: string, type: 'html' | 'sfdt') {
    const { Authorization } = this._recognitionInternal.iaraAPIMandatoryHeaders;
    let htmlContent: any = type == 'html' ? { html: template } : { sfdt: template };
    let endpoint = 'https://api.iarahealth.com/speech/syncfusion/';
    endpoint += type == 'html' ? 'html_to_sfdt/' : 'sfdt_to_html/';

    var headers = new Headers();
    headers.append("Content-Type", "application/json;charset=UTF-8");
    headers.append("Authorization", Authorization);

    const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(htmlContent),
      })
      .then(async (response) => await response.json())
      .catch(function (error) {
        console.error(error.message)
      });

    return response;
  }

  async insertTemplate(template: string) {
    const response = await this.converter(template, 'html');
    this._editor.open(response);
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

  blockEditorWhileSpeech (status: boolean) {
    const wrapper = document.getElementById('iara-syncfusion-editor-container')
    if (wrapper) status ? wrapper.style.cursor = 'not-allowed' : wrapper.style.cursor = 'auto'
  }

  undo() {
    this._editorHistory.undo();
  }
}
