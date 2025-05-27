export abstract class IaraEditorStyleManager {
  abstract toggleBold(): void;
  abstract toggleItalic(): void;
  abstract toggleList(): void;
  abstract toggleNumberedList(): void;
  abstract toggleUnderline(): void;
  abstract toggleUppercase(): void;
  abstract setSelectionFontFamily(fontName: string): void;
  abstract setSelectionFontSize(fontSize: number): void;
  abstract setSelectionParagraphSpacingFormat(paragraphSpacing: {
    after: number;
    before: number;
  }): void;
  abstract setEditorFontColor(fontColor: string): void;
}
