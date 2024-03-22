export abstract class IaraEditorStyleManager {
  abstract toggleBold(): void;
  abstract toggleItalic(): void;
  abstract toggleUnderline(): void;
  abstract toggleUppercase(): void;
  abstract setSelectionFontFamily(fontName: string): void;
  abstract setSelectionFontSize(fontSize: number): void;
  abstract setEditorFontColor(fontColor: string): void;
}
