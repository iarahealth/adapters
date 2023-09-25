import type { Editor, EditorHistory, Selection } from "@syncfusion/ej2-documenteditor";
import { EditorAdapter } from "../editor";
import { IaraInference } from "../speech";
import { IaraSyncfusionInferenceFormatter } from "./formatter";

export class IaraSyncfusionAdapter
  extends EditorAdapter
  implements EditorAdapter
{
  private _initialUndoStackSize = 0;
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
    this._inferenceFormatter = new IaraSyncfusionInferenceFormatter(this._editorSelection);
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
      if (this._editorSelection.text.length) this._editorAPI.delete();
      this._initialUndoStackSize = this.getUndoStackSize();
    } else {
      const undoStackSize = this.getUndoStackSize();
      for (let i = 0; i < undoStackSize - this._initialUndoStackSize; i++)
      this.undo();
    }

    const text = this._inferenceFormatter.format(inference);
   
    let [firstLine, ...lines]: string[] = text.split("</div><div>");
    this.insertText(firstLine);

    lines.forEach(line => {
      this.insertParagraph();
      line = line.trimStart();
      if (line) this.insertText(line);
    });
  }

  blockEditorWhileSpeaking (status: boolean) {
    const wrapper = document.getElementById('iara-syncfusion-editor-container')
    if (wrapper) status ? wrapper.style.cursor = 'not-allowed' : wrapper.style.cursor = 'auto'
  }

  undo() {
    this._editorHistory.undo();
  }
}
