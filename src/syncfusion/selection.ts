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
import { IaraEditorInferenceFormatter } from "../editor/formatter";

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
    this._editor.editor.insertBookmark(this.initialSelectionData.bookmarkId);

    if (!getSurrondingWords) return;

    this._editor.selection.select(startOffset, endOffset);
    this.wordBeforeSelection = this._getWordBeforeSelection();

    this._editor.selection.select(startOffset, endOffset);
    this.wordAfterSelection = this._getWordAfterSelection();

    this._editor.selection.extendToLineStart();
    this.isAtStartOfLine = this._editor.selection.text.length === 0;

    this.resetSelection();
  }

  private _getWordAfterSelection(): string {
    this._editor.selection.extendToLineEnd();
    const startsWithSpace = this._editor.selection.text.startsWith(" ");
    const words = this._editor.selection.text
      .split(" ")
      .slice(0, 2)
      .filter(word => word.trim());
    const wordAfter = `${startsWithSpace ? " " : ""}${words[0] || ""}`;
    return wordAfter;
  }

  private _getWordBeforeSelection(): string {
    this._editor.selection.extendToLineStart();
    const endsWithSpace = this._editor.selection.text.endsWith(" ");
    const words = this._editor.selection.text
      .split(" ")
      .slice(-2)
      .filter(word => word.trim());
    const wordBefore = `${words.pop() || ""}${endsWithSpace ? " " : ""}`;
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

  public changeSelectionPosition(
    inferenceFormatter: IaraEditorInferenceFormatter
  ): void {
    const parsedText = inferenceFormatter.parseMeasurements(
      this._editor.selection.text
    );
    if (parsedText !== this._editor.selection.text) {
      const currentBookmark = this._editor.selection.getBookmarks();
      currentBookmark.map(current => {
        this.selectBookmark(current);
        console.log(this._editor.selection.text, "BOOKMARK TEXT");
        console.log(parsedText, "PARSED");
        this._editor.editor.insertText(` ${parsedText}`);
      });
    }
  }

  public destroy() {
    this._editor.editor.deleteBookmark(this.initialSelectionData.bookmarkId);
    this._editor.selection.movePreviousPosition();
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
    excludeBookmarkStartEnd?: boolean
  ): void {
    IaraSyncfusionSelectionManager.selectBookmark(
      this._editor,
      bookmarkId,
      excludeBookmarkStartEnd
    );
  }

  // Prevent scrolling to the bookmark when selecting it
  public static selectBookmark(
    documentEditor: DocumentEditor,
    bookmarkId: string,
    excludeBookmarkStartEnd?: boolean
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

      const startPosition: TextPosition = new TextPosition(documentEditor);
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
