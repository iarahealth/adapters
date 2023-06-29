import type {
  DocumentEditor,
  Editor,
  EditorHistory,
} from "@syncfusion/ej2-documenteditor";
import { EditorAdapter } from "../editor";
import { IaraInference } from "../speech";

export class IaraSyncfusionAdapter
  extends EditorAdapter
  implements EditorAdapter
{
  private _initialUndoStackSize = 0;

  private get _editor(): Editor {
    return this._documentEditor.editor;
  }

  private get _editorHistory(): EditorHistory {
    return this._documentEditor.editorHistory;
  }

  constructor(
    protected _recognition: any,
    private _documentEditor: DocumentEditor
  ) {
    super(_recognition);
    console.log("this._documentEditor", this._documentEditor);
  }

  getUndoStackSize(): number {
    return this._editorHistory.undoStack?.length || 0;
  }

  insertParagraph() {
    this._editor.insertText("\n");
  }

  insertText(text: string) {
    this._editor.insertText(text);
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
