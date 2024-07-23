import type {
  BaselineAlignment,
  DocumentEditor,
  HighlightColor,
  Strikethrough,
  Underline,
} from "@syncfusion/ej2-documenteditor";
import { v4 as uuidv4 } from "uuid";
import { IaraSyncfusionConfig } from ".";

interface SelectionData {
  bookmarkId: string;
  characterFormat: SelectionCharacterFormatData;
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
    bookmarkId?: string,
    getSurrondingWords = false,
    highlightSelection = false
  ) {
    if (highlightSelection) this._highlightSelection();

    const characterFormat = this._editor.selection.characterFormat;
    this.initialSelectionData = {
      bookmarkId: bookmarkId || uuidv4(),
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
    };

    const { endOffset, startOffset } = this._editor.selection;
    this.isAtStartOfLine = startOffset.endsWith(";0");
    this._moveSelectionFromBookmarkEdges();

    this._editor.editor.insertBookmark(this.initialSelectionData.bookmarkId);

    if (!getSurrondingWords) return;

    this._editor.selection.select(startOffset, endOffset);
    this.wordBeforeSelection = this._getWordBeforeSelection();

    const isLineStart =
      /[\n\r\v]$/.test(this.wordBeforeSelection) ||
      this.wordBeforeSelection.length === 0;

    this._editor.selection.select(startOffset, endOffset);
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

  private _highlightSelection(): void {
    this._config.darkMode
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        (this._editor.selection.characterFormat.highlightColor = "#0e5836")
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        (this._editor.selection.characterFormat.highlightColor = "#ccffe5");
  }

  private _moveSelectionFromBookmarkEdges(): void {
    const bookmarksAtCursor = this._editor.selection.getBookmarks();
    if (bookmarksAtCursor) {
      const { endOffset, startOffset } = this._editor.selection;

      // If there are any bookmarks at cursor position, check if we are on the edge of any of them.
      bookmarksAtCursor.forEach(cursorBookmarkID => {
        // Select bookmark without selecting the edge itself as the cursor will not be at the edge
        this._editor.selection.selectBookmark(cursorBookmarkID, true);
        const {
          endOffset: bookmarkEndOffset,
          startOffset: bookmarkStartOffset,
        } = this._editor.selection;
        
        if (bookmarkStartOffset === startOffset) {
          this.moveSelectionToBeforeBookmarkEdge(cursorBookmarkID);
        } else if (bookmarkEndOffset === endOffset) {
          this.moveSelectionToAfterBookmarkEdge(cursorBookmarkID);
        }
      });
    }
  }

  public destroy() {
    this._editor.editor.deleteBookmark(this.initialSelectionData.bookmarkId);
  }

  public resetSelection(resetStyles = true): void {
    this._editor.selection.selectBookmark(
      this.initialSelectionData.bookmarkId,
      true
    );
    if (resetStyles) {
      this.resetStyles();
    }
  }

  public moveSelectionToAfterBookmarkEdge(bookmarkId: string): void {
    this._editor.selection.selectBookmark(bookmarkId, false);
    this._editor.selection.moveNextPosition();
  }

  public moveSelectionToBeforeBookmarkEdge(bookmarkId: string): void {
    this._editor.selection.selectBookmark(bookmarkId, false);
    this._editor.selection.movePreviousPosition();
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
