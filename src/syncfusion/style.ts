import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { IaraEditorStyleManager } from "../editor/style";

export class IaraSyncfusionStyleManager extends IaraEditorStyleManager {
  constructor(private _editor: DocumentEditor) {
    super();
  }

  setFontFamily(fontFamily: string): void {
    this._editor.selection.characterFormat.fontFamily = fontFamily;
    this._editor.focusIn();
  }
  setFontSize(fontSize: number): void {
    this._editor.selection.characterFormat.fontSize = fontSize;
    this._editor.focusIn();
  }
  toggleBold(): void {
    this._editor.editor.toggleBold();
  }
  toggleItalic(): void {
    this._editor.editor.toggleItalic();
  }
  toggleUnderline(): void {
    this._editor.editor.toggleUnderline("Single");
  }

  toggleUppercase(): void {
    this._editor.editor.toggleAllCaps();
  }
}
