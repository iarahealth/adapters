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

  private textFormatter(nextText: string) {
    let textFormatted = nextText
    const upperCaseCondition: Array<string> = ['.',':',';','?','!','\n']
    // Needed to be "any" due to lack of correct declarations in"@syncfusion/ej2-documenteditor"
    const lastContent = this._editorSelection.end.paragraph.lastChild as any
    const previousText = lastContent.renderedElements[0]?.text

    function upperText (text: string) {return text.charAt(0).toUpperCase() + text.slice(1)}

    // It has text before it.
    if (previousText) {
      // Caso possua condições para ser captalizado.
      if (upperCaseCondition.includes(previousText.substr(-1))) {
        textFormatted = upperText(textFormatted)
      }

      // Adds space if there is text before it.
      if (previousText.length > 0) {
        textFormatted = ' '+textFormatted
      }
    }

    return textFormatted
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

  }

  undo() {
    this._editorHistory.undo();
  }
}
