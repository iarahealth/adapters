import {
  BaselineAlignment,
  DocumentEditor,
  HighlightColor,
  Strikethrough,
  Underline
} from "@syncfusion/ej2-documenteditor";
import { v4 as uuidv4 } from "uuid";
import { IaraSyncfusionConfig } from ".";

interface SelectionData {
  bookmarkId: string;
  characterFormat: SelectionCharacterFormatData;
  endOffset: string;
  isAtStartOfLine: boolean;
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

  constructor(
    private _editor: DocumentEditor,
    private _config: IaraSyncfusionConfig,
    bookmarkId?: string,
    getSurrondingWords = false,
    highlightSelection = false
  ) {
    const isAtStartOfLine = this._editor.selection.startOffset.endsWith(";0");
    if (highlightSelection) this._highlightSelection();
    const characterFormat = {
      allCaps: this._editor.selection.characterFormat.allCaps,
      baselineAlignment:
        this._editor.selection.characterFormat.baselineAlignment,
      bold: this._editor.selection.characterFormat.bold,
      fontColor: this._editor.selection.characterFormat.fontColor,
      fontFamily: this._editor.selection.characterFormat.fontFamily,
      fontSize: this._editor.selection.characterFormat.fontSize,
      highlightColor: this._editor.selection.characterFormat.highlightColor,
      italic: this._editor.selection.characterFormat.italic,
      strikethrough: this._editor.selection.characterFormat.strikethrough,
      underline: this._editor.selection.characterFormat.underline,
    };

    bookmarkId = bookmarkId || uuidv4();
    this._editor.editor.insertBookmark(bookmarkId);

    this.initialSelectionData = {
      bookmarkId,
      characterFormat,
      endOffset: this._editor.selection.endOffset,
      isAtStartOfLine: isAtStartOfLine,
      startOffset: this._editor.selection.startOffset,
    };

    if (!getSurrondingWords) return;

    this._editor.selection.select(
      this.initialSelectionData.startOffset,
      this.initialSelectionData.endOffset
    );
    this.wordBeforeSelection = this._getWordBeforeSelection();

    if (this.wordBeforeSelection.endsWith(" ")) {
      // Removes trailing space so that the formatter can determine whether the space is required or not.
      // I.e. if the inference starts with a punctuation, there would be an extra space.
      this.moveToPreviousPosition(this.initialSelectionData.startOffset);
      this._editor.selection.extendBackward();
      this._editor.editor.delete();
      this.wordBeforeSelection = this.wordBeforeSelection.slice(
        0,
        this.wordBeforeSelection.length - 1
      );
      this.moveToNextPosition(this._editor.selection.startOffset);
      this.initialSelectionData.startOffset =
        this._editor.selection.startOffset;
      this.initialSelectionData.endOffset = this._editor.selection.endOffset;
    }

    const isLineStart =
      /[\n\r\v]$/.test(this.wordBeforeSelection) ||
      this.wordBeforeSelection.length === 0;

    this._editor.selection.select(
      this.initialSelectionData.startOffset,
      this.initialSelectionData.endOffset
    );
    this.wordAfterSelection = this._getWordAfterSelection(isLineStart);

    this.resetSelection();
  }

  private _getWordAfterSelection(isLineStart = false): string {
    // Move from bookmark edge
    this.moveToNextPosition(this._editor.selection.startOffset);

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
    // Move from bookmark edge
    this.moveToPreviousPosition(this._editor.selection.startOffset);

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

  private _highlightSelection(): void {
    this._config.darkMode
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        (this._editor.selection.characterFormat.highlightColor = "#0e5836")
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        (this._editor.selection.characterFormat.highlightColor = "#ccffe5");
  }

  public destroy() {
    this._editor.editor.deleteBookmark(this.initialSelectionData.bookmarkId);
  }

  public moveToPreviousPosition(offset: string) {
    this.moveToPreviousNPositions(offset, 1);
  }

  public moveToPreviousNPositions(offset: string, n: number) {
    offset = offset
      .split(";")
      .map((value, index) =>
        index === 2 ? parseInt(value) - n : parseInt(value)
      )
      .join(";");
    this._editor.selection.select(offset, offset);
  }

  public moveToNextPosition(offset: string) {
    this.moveToNextNPositions(offset, 1);
  }

  public moveToNextNPositions(offset: string, n: number) {
    offset = offset
      .split(";")
      .map((value, index) =>
        index === 2 ? parseInt(value) + n : parseInt(value)
      )
      .join(";");
    this._editor.selection.select(offset, offset);
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
