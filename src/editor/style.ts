export abstract class IaraEditorStyleManager {
  abstract toggleBold(): void;
  abstract toggleItalic(): void;
  abstract toggleUnderline(): void;
  abstract toggleUppercase(): void;
  abstract setFontFamily(fontName: string): void;
  abstract setFontSize(fontSize: number): void;
}
