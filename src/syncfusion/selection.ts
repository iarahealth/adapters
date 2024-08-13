import {
  BaselineAlignment,
  BookmarkElementBox,
  Dictionary,
  DocumentEditor,
  HighlightColor,
  Strikethrough,
  TextPosition,
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

  public destroy() {
    let { endOffset, startOffset } = this._editor.selection;
    this._editor.editor.deleteBookmark(this.initialSelectionData.bookmarkId);
    this._editor.selection.select(startOffset, startOffset);
    this._editor.selection.movePreviousPosition();
    startOffset = this._editor.selection.startOffset;
    this._editor.selection.select(endOffset, endOffset);
    this._editor.selection.movePreviousPosition();
    this._editor.selection.select(startOffset, this._editor.selection.endOffset);
  }

  public resetSelection(resetStyles = true): void {
    this.selectBookmark(this.initialSelectionData.bookmarkId, true);
    if (resetStyles) {
      this.resetStyles();
    }
  }

  public moveSelectionToAfterBookmarkEdge(bookmarkId: string): void {
    this.selectBookmark(bookmarkId, false);
    this._editor.selection.moveNextPosition();
  }

  public moveSelectionToBeforeBookmarkEdge(bookmarkId: string): void {
    this.selectBookmark(bookmarkId, false);
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

  public selectBookmark(
    bookmarkId: string,
    excludeBookmarkStartEnd?: boolean,
  ): void {
    IaraSyncfusionSelectionManager.selectBookmark(
      this._editor,
      bookmarkId,
      excludeBookmarkStartEnd,
    );
  }

  // Prevent scrolling to the bookmark when selecting it
  public static selectBookmark(
    documentEditor: DocumentEditor,
    bookmarkId: string,
    excludeBookmarkStartEnd?: boolean,
  ): void {
    const bookmarks: Dictionary<string, BookmarkElementBox> =
      documentEditor.documentHelper.bookmarks;

    if (bookmarks.containsKey(bookmarkId)) {
      //bookmark start element
      const bookmrkElmnt: BookmarkElementBox = bookmarks.get(bookmarkId);

      let offset: number = bookmrkElmnt.line.getOffset(bookmrkElmnt, 0);

      if (excludeBookmarkStartEnd) {
        offset++;
      }

      const startPosition: TextPosition = new TextPosition(
        documentEditor
      );
      startPosition.setPositionParagraph(bookmrkElmnt.line, offset);

      //bookmark end element
      let bookmrkEnd: BookmarkElementBox = bookmrkElmnt.reference;
      if (
        bookmrkElmnt.reference &&
        bookmrkElmnt.reference.line.paragraph.bodyWidget == null
      ) {
        bookmrkEnd = bookmrkElmnt;
      }

      let endoffset: number = bookmrkEnd.line.getOffset(bookmrkEnd, 1);

      if (excludeBookmarkStartEnd) {
        endoffset--;
      }
      const endPosition: TextPosition = new TextPosition(documentEditor);
      endPosition.setPositionParagraph(bookmrkEnd.line, endoffset);
      //selects the bookmark range
      documentEditor.documentHelper.selection.selectRange(
        startPosition,
        endPosition
      );
    }
  }
}
