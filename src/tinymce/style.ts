import { IaraEditorStyleManager } from "../editor/style";

export class IaraTinyMceStyleManager extends IaraEditorStyleManager {
  setSelectionFontFamily(_fontName: string): void {
    throw new Error("Method not implemented.");
  }
  setSelectionFontSize(_fontSize: number): void {
    throw new Error("Method not implemented.");
  }
  setEditorFontColor(_fontColor: string): void {
    throw new Error("Method not implemented.");
  }
  toggleBold(): void {
    throw new Error("Method not implemented.");
  }
  toggleItalic(): void {
    throw new Error("Method not implemented.");
  }
  toggleUnderline(): void {
    throw new Error("Method not implemented.");
  }
  toggleUppercase(): void {
    throw new Error("Method not implemented.");
  }
}
