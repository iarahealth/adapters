import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { IaraEditorStyleManager } from "../editor/style";

export class IaraSyncfusionStyleManager extends IaraEditorStyleManager {
  constructor(private _editor: DocumentEditor) {
    super();
  }

  setSelectionFontFamily(fontFamily: string): void {
    this._editor.selection.characterFormat.fontFamily = fontFamily;
    this._editor.focusIn();
  }
  setSelectionFontSize(fontSize: number): void {
    this._editor.selection.characterFormat.fontSize = fontSize;
    this._editor.focusIn();
  }

  setEditorFontColor(color: string)
  {
    this._editor.setDefaultCharacterFormat({ fontColor: color });
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
    throw new Error("Método não implementado.");
  }
}
