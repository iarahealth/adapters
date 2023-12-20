import type { Editor, EditorHistory } from "@syncfusion/ej2-documenteditor";
import { EditorAdapter, setEditorFont } from "../editor";
import { IaraInference } from "../speech";

export class syncfusionDefaultFont
  extends setEditorFont
  implements setEditorFont
{
    defaultFormat: object;
 
    constructor() 
    {
        super();
                
        this.defaultFormat = {
            bold: false,   
            italic: false,   
            baselineAlignment: 'Normal',   
            underline: 'None',   
            fontColor: "red",   
            fontFamily: 'Segoe UI',   
            fontSize: 22   
        };
    }
}


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

  undo() {
    this._editorHistory.undo();
  }
}
