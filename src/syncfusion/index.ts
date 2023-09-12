import type { Editor, EditorHistory, Selection } from "@syncfusion/ej2-documenteditor";
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

  private get _editorSelection(): Selection {
    return this._editor.selection;
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

  public setEditorContent(content: any) {
    content = "<?xml version='1.0' encoding='utf - 8'?><!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN''http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html xmlns ='http://www.w3.org/1999/xhtml' xml:lang='en' lang ='en'><body><h1>The img element</h1><img src='https://www.w3schools.com/images/lamp.jpg' alt ='Lamp Image' width='500' height='600'/></body></html>";

    this._editorAPI.delete();

    let http: XMLHttpRequest = new XMLHttpRequest();
    let response: any;

    http.open('POST', '/api/documenteditor/LoadString');
    http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    http.responseType = 'json';
    http.onreadystatechange = function () {
      if ( http.readyState === 4 ) {
        if ( http.status === 200 || http.status === 304 ) {
          response = http.response;
          return;
        }
        console.error('Falha na conversão sfdt');
      }
    };

    this._editorAPI.paste(response);

    let htmlContent: any = { content: content };
    http.send(JSON.stringify(htmlContent));
  }

  private textFormatter(nextText: string) {
    let textFormatted = nextText;
    const upperCaseCondition: Array<string> = ['.',':',';','?','!','\n'];

    // Get previous content
    this._editorSelection.selectParagraph();
    let previousText: string = this._editorSelection.text;

    function upperText (text: string) {return text.charAt(0).toUpperCase() + text.slice(1)}

    // It has text before it.
    if (previousText) {
      // Capitalized Filter
      if (upperCaseCondition.includes(previousText.substr(-1))) {
        textFormatted = upperText(textFormatted);
      }

      // Space Filter
      if (previousText.length > 0) {
        textFormatted = ' '+textFormatted;
      }
    }

    return previousText + textFormatted;
  }

  insertInference(inference: IaraInference) {
    // Skip inference insertion if transcript is empty.
    if (!inference.transcript) return

    if (inference.isFirst) {
      this._initialUndoStackSize = this.getUndoStackSize();
    } else {
      const undoStackSize = this.getUndoStackSize();
      for (let i = 0; i < undoStackSize - this._initialUndoStackSize; i++)
        this.undo();
    }

    let text = inference.richTranscript
      .replace(/^<div>/, "")
      .replace(/<\/div>$/, "");
    
    text = this.textFormatter(text)

    const [firstLine, ...lines]: string[] = text.split("</div><div>");

    this.insertText(firstLine);

    lines.forEach(line => {
      this.insertParagraph();
      line = line.trim();
      if (line) this.insertText(line);
    });

    this.setEditorContent(inference);

  }

  undo() {
    this._editorHistory.undo();
  }
}
