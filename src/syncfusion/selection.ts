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
        bold: characterFormat.allCaps,
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

    this._resetSelection();

    return wordAfter;
  }

  public getWordBeforeSelection(): string {
    this._editor.selection.extendToWordStart();
    const wordBefore = this._editor.selection.text.trimStart();

    this._resetSelection();

    return wordBefore;
  }

  private _resetSelection() {
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

    if (this._initialSelectionData.characterFormat.bold) {
      // this._initialSelectionData.characterFormat.bold = false;
    }

    charFormatProps.forEach(prop => {
      (this._editor.selection.characterFormat as any)[prop] =
        this._initialSelectionData.characterFormat[prop];
    });
  }
}
