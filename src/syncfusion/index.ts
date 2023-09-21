import type { Editor, EditorHistory, Selection } from "@syncfusion/ej2-documenteditor";
import { EditorAdapter } from "../editor";
import { IaraInference } from "../speech";

interface SelectionOffsets {
  end: string; 
  start: string;
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

  private get _editorSelection(): Selection {
    return this._editor.selection;
  }

  private _addTrailingSpaces(text: string) {    
    const initialSelectionOffsets = {end: this._editorSelection.endOffset, start: this._editorSelection.startOffset};
    const wordAfter = this._getWordAfterSelection(initialSelectionOffsets);
    const wordBefore = this._getWordBeforeSelection(initialSelectionOffsets);

    const prefix = (wordBefore.length && !wordBefore.endsWith(' ')) ? ' ': '';
    const suffix = (wordAfter.length && !wordAfter.startsWith(' ')) ? ' ': '';
    return `${prefix}${text}${suffix}`;
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

    let text = inference.richTranscript
      .replace(/^<div>/, "")
      .replace(/<\/div>$/, "");
    text = this._addTrailingSpaces(text);
   
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
