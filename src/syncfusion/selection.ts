import type {
  BaselineAlignment,
  DocumentEditor,
  HighlightColor,
  Strikethrough,
  Underline,
} from "@syncfusion/ej2-documenteditor";

interface SelectionData {
  characterFormat: SelectionCharacterFormatData;
  endOffset: string;
  startOffset: string;
}

interface SelectionCharacterFormatData {
  allCaps: boolean;
  baselineAlignment: BaselineAlignment;
  bold: boolean;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
  highlightColor: HighlightColor;
  italic: boolean;
  strikethrough: Strikethrough;
  underline: Underline;
}

export class IaraSyncfusionSelectionManager {
  private _initialSelectionData: SelectionData;

  constructor(private _editor: DocumentEditor) {
    const characterFormat = this._editor.selection.characterFormat;
    this._initialSelectionData = {
      characterFormat: {
        allCaps: characterFormat.allCaps,
        baselineAlignment: characterFormat.baselineAlignment,
        bold: characterFormat.bold,
        fontColor: characterFormat.fontColor,
        fontFamily: characterFormat.fontFamily,
        fontSize: characterFormat.fontSize,
        highlightColor: characterFormat.highlightColor,
        italic: characterFormat.italic,
        strikethrough: characterFormat.strikethrough,
        underline: characterFormat.underline,
      },
      endOffset: this._editor.selection.endOffset,
      startOffset: this._editor.selection.startOffset,
    };
  }

  public getWordAfterSelection(isLineStart = false): string {
    this._editor.selection.extendToWordEnd();
    //nbsp is a non-breaking space \u00A0.
    //zwnj is a zero-width non-joiner \u200c.
    const isNbspOrZwnj =
      /^\u00A0/.test(this._editor.selection.text) ||
      /^\u200c/.test(this._editor.selection.text);

    if (isLineStart || isNbspOrZwnj) {
      //at line start extendsToWordEnd may return /r instead of the word
      this._editor.selection.extendToWordEnd();
    }
    const wordAfter = this._editor.selection.text;

    this.resetSelection(false);
    return wordAfter;
  }

  public getWordBeforeSelection(): string {
    this._editor.selection.extendToWordStart();
    //nbsp is a non-breaking space \u00A0.
    //zwnj is a zero-width non-joiner \u200c.
    const isNbspOrZwnj =
      /^\u00A0/.test(this._editor.selection.text) ||
      /^\u200c/.test(this._editor.selection.text);

    //we want to ignore nbsp or zwnj as they are not rendered
    if (isNbspOrZwnj) this._editor.selection.extendToWordStart();

    const wordBefore = this._editor.selection.text;

    this.resetSelection(false);
    return wordBefore;
  }

  public resetSelection(resetStyles = true): void {
    this._editor.selection.select(
      this._initialSelectionData.startOffset,
      this._initialSelectionData.endOffset
    );
    if (resetStyles) {
      const charFormatProps: (keyof SelectionCharacterFormatData)[] = [
        "allCaps",
        "baselineAlignment",
        "bold",
        "fontColor",
        "fontFamily",
        "fontSize",
        "highlightColor",
        "italic",
        "strikethrough",
        "underline",
      ];

      charFormatProps.forEach(prop => {
        (this._editor.selection.characterFormat as any)[prop] =
          this._initialSelectionData.characterFormat[prop];
      });
    }
  }
}
