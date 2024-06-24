import type {
  BaselineAlignment,
  DocumentEditor,
  HighlightColor,
  Strikethrough,
  Underline,
} from "@syncfusion/ej2-documenteditor";
import { IaraSyncfusionConfig } from ".";

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
  public initialSelectionData: SelectionData;
  public wordAfterSelection = "";
  public wordBeforeSelection = "";
  public isAtStartOfLine = false;

  constructor(
    private _editor: DocumentEditor,
    private _config: IaraSyncfusionConfig,
    getSurrondingWords = true
  ) {
    const characterFormat = this._editor.selection.characterFormat;
    this._inferencehighlightColor();
    this.initialSelectionData = {
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
    this.isAtStartOfLine = this._editor.selection.startOffset.endsWith(";0");

    if (!getSurrondingWords) return;

    this.wordBeforeSelection = this._getWordBeforeSelection();
    this.resetSelection(false);

    const isLineStart =
      /[\n\r\v]$/.test(this.wordBeforeSelection) ||
      this.wordBeforeSelection.length === 0;

    this.wordAfterSelection = this._getWordAfterSelection(isLineStart);
    this.resetSelection();
  }

  private _getWordAfterSelection(isLineStart = false): string {
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
    return wordAfter;
  }

  private _getWordBeforeSelection(): string {
    this._editor.selection.extendToWordStart();
    //nbsp is a non-breaking space \u00A0.
    //zwnj is a zero-width non-joiner \u200c.
    const isNbspOrZwnj =
      /^\u00A0/.test(this._editor.selection.text) ||
      /^\u200c/.test(this._editor.selection.text);

    //we want to ignore nbsp or zwnj as they are not rendered
    if (isNbspOrZwnj) this._editor.selection.extendToWordStart();

    const wordBefore = this._editor.selection.text;
    return wordBefore;
  }

  private _inferencehighlightColor(): void {
    if (this._config.highlightInference) {
      this._config.darkMode
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          (this._editor.selection.characterFormat.highlightColor = "#0e5836")
        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          (this._editor.selection.characterFormat.highlightColor = "#ccffe5");
    }
  }

  public resetSelection(resetStyles = true): void {
    this._editor.selection.select(
      this.initialSelectionData.startOffset,
      this.initialSelectionData.endOffset
    );
    if (resetStyles) {
      this.resetStyles();
    }
  }

  public resetStyles(): void {
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
        this.initialSelectionData.characterFormat[prop];
    });
  }
}
