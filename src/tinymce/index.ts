import { EditorAdapter } from "../editor";
import { IaraInference } from "../speech";

export class IaraTinyMCEAdapter extends EditorAdapter implements EditorAdapter {
  private _initialUndoStackSize = 0;

  private get _editorAPI() {
    return this._editor.activeEditor;
  }

  getUndoStackSize(): number {
    return this._editorAPI.undoManager.data.length || 0;
  }

  insertInference(inference: IaraInference): void {
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

    this.insertText(`${firstLine}\n`);

    lines.forEach(line => {
      this.insertParagraph();
      line = line.trim();
      if (line) this.insertText(line);
    });
  }

  insertParagraph() {
    this._editorAPI.execCommand("InsertParagraph");
  }

  insertText(text: string) {
    this._editorAPI.insertContent(text);
  }

  blockEditorWhileSpeech (status: boolean) {
    const wrapper = document.getElementsByTagName('tinymce')[0] as HTMLElement
    if (wrapper) status ? wrapper.style.cursor = 'not-allowed' : wrapper.style.cursor = 'auto'
  }

  undo() {
    this._editorAPI.undoManager.undo();
  }
}
