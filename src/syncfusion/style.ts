import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import { IaraEditorStyleManager } from "../editor/style";
import { IaraSyncfusionSelectionManager } from "./selection";

export class IaraSyncfusionStyleManager extends IaraEditorStyleManager {
  constructor(
    private _editor: DocumentEditorContainer,
    private _selectionManager: IaraSyncfusionSelectionManager
  ) {
    super();
  }

  setFontFamily(fontFamily: string): void {
    this._selectionManager.selection.characterFormat.fontFamily = fontFamily;
    this._editor.documentEditor.focusIn();
  }
  setFontSize(fontSize: number): void {
    this._selectionManager.selection.characterFormat.fontSize = fontSize;
    this._editor.documentEditor.focusIn();
  }
  toggleBold(): void {
    this._editor.documentEditor.editor.toggleBold();
  }
  toggleItalic(): void {
    this._editor.documentEditor.editor.toggleItalic();
  }
  toggleUnderline(): void {
    this._editor.documentEditor.editor.toggleUnderline("Single");
  }
  toggleUppercase(): void {
    throw new Error("Método não implementado.");
  }
}
