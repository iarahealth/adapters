import type {
  BaselineAlignment,
  DocumentEditor,
  HighlightColor,
  SelectionCharacterFormat,
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

  public getWordAfterSelection(): string {
    this._editor.selection.extendToWordEnd();
    const wordAfter = this._editor.selection.text.trimEnd();
    return wordAfter;
  }

  public getWordBeforeSelection(): string {
    this._editor.selection.extendToWordStart();
    const wordBefore = this._editor.selection.text.trimStart();
    return wordBefore;
  }

  public resetSelection() {
    this._editor.selection.select(
      this._initialSelectionData.startOffset,
      this._initialSelectionData.endOffset
    );

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
