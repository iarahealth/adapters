import {
  BookmarkElementBox,
  Dictionary,
  DocumentEditorContainer,
  TextPosition,
} from "@syncfusion/ej2-documenteditor";
import { IaraBookmark } from "./bookmark";
import { IaraEditorNavigationFieldManager } from "../../editor/navigationFields";

export class IaraSyncfusionNavigationFieldManager extends IaraEditorNavigationFieldManager {
  previousBookmark: IaraBookmark = {
    name: "",
    content: "",
    title: "",
    offset: {
      start: "",
      end: "",
    },
  };
  nextBookmark: IaraBookmark = {
    name: "",
    content: "",
    title: "",
    offset: {
      start: "",
      end: "",
    },
  };
  currentSelectionOffset: {
    start: string;
    end: string;
  } = {
    start: "",
    end: "",
  };
  insertedBookmark: IaraBookmark = {
    name: "",
    content: "",
    title: "",
    offset: {
      start: "",
      end: "",
    },
  };
  isFirstNextNavigation = false;
  isFirstPreviousNavigation = false;

  private _bookmarks: IaraBookmark[] = [];

  constructor(private _editorContainer: DocumentEditorContainer) {
    super();
    const navigationBtn = <HTMLElement>(
      document.getElementById("navigation_fields")
    );

    navigationBtn.addEventListener("click", () => {
      const insertBtn = <HTMLElement>document.getElementById("add_field");
      const nextFieldBtn = <HTMLElement>document.getElementById("next_field");
      const previousFieldBtn = <HTMLElement>(
        document.getElementById("previous_field")
      );
      insertBtn.addEventListener("click", () => {
        this.insertField();
      });
      nextFieldBtn.addEventListener("click", () => {
        this.nextField();
      });
      previousFieldBtn.addEventListener("click", () => {
        this.previousField();
      });
    });
  }

  insertField(): void {
    const bookmarksCount = Date.now();
    this._editorContainer.documentEditor.editor.insertBookmark(
      `Bookmark${bookmarksCount}`
    );
    const content = "Escreva uma dica de texto";
    const title = "Nome do campo";
    this._editorContainer.documentEditor.editor.insertText("[]");
    this._editorContainer.documentEditor.selection.movePreviousPosition();
    this._editorContainer.documentEditor.editor.insertText("<>");
    this._editorContainer.documentEditor.selection.movePreviousPosition();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this._editorContainer.documentEditor.selection.characterFormat.highlightColor =
      "#9e9ef4";
    this._editorContainer.documentEditor.editor.insertText(`${title}`);
    this._editorContainer.documentEditor.selection.clear();
    this._editorContainer.documentEditor.selection.moveNextPosition();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this._editorContainer.documentEditor.selection.characterFormat.highlightColor =
      "#c0beff";
    this._editorContainer.documentEditor.editor.insertText(`${content}`);
    this._editorContainer.documentEditor.selection.selectBookmark(
      `Bookmark${bookmarksCount}`,
      true
    );
    this.getBookmarks();
    this.isFirstNextNavigation = true;
    this.isFirstPreviousNavigation = true;
    this.selectTitleField(content);
  }

  getBookmarks(): void {
    const editorBookmarks = this._editorContainer.documentEditor.getBookmarks();
    editorBookmarks.map(bookmark => {
      this.getOffsets(bookmark, true);
      const bookmarkContent =
        this._editorContainer.documentEditor.selection.text;

      const { title, content } = this.getNames(bookmarkContent);

      this.popAndUpdate(bookmark, content, title);
      this.removeEmptyField();
    });
    if (this.isFirstNextNavigation || this.isFirstPreviousNavigation)
      this.insertedBookmark = this._bookmarks[0];
    else this.sortByPosition();
    this.getPreviousAndNext(this.currentSelectionOffset);
    this._editorContainer.documentEditor.selection.clear();
  }

  nextField(isShortcutNavigation?: boolean): void {
    this.currentSelectionOffset = {
      start: this._editorContainer.documentEditor.selection.startOffset,
      end: this._editorContainer.documentEditor.selection.endOffset,
    };
    this.getBookmarks();

    if (isShortcutNavigation && this.isFirstNextNavigation)
      this.selectContentField();
    else {
      this._editorContainer.documentEditor.selection.select(
        this.nextBookmark.offset.start,
        this.nextBookmark.offset.end
      );
    }
    this.isFirstNextNavigation = false;
    this.currentSelectionOffset = {
      start: this.nextBookmark.offset.start,
      end: this.nextBookmark.offset.end,
    };

    this._editorContainer.documentEditor.selection.characterFormat.highlightColor =
      "Gray25";
  }

  previousField(isShortcutNavigation?: boolean): void {
    this.currentSelectionOffset = {
      start: this._editorContainer.documentEditor.selection.startOffset,
      end: this._editorContainer.documentEditor.selection.endOffset,
    };

    this.getBookmarks();

    if (isShortcutNavigation && this.isFirstPreviousNavigation)
      this.selectTitleField(this.insertedBookmark.content);
    else {
      this._editorContainer.documentEditor.selection.select(
        this.previousBookmark.offset.start,
        this.previousBookmark.offset.end
      );
    }
    this.isFirstPreviousNavigation = false;
    this.currentSelectionOffset = {
      start: this.previousBookmark.offset.start,
      end: this.previousBookmark.offset.end,
    };
    this._editorContainer.documentEditor.selection.characterFormat.highlightColor =
      "Gray25";
  }

  selectContentField(): void {
    const title = this.insertedBookmark.title;
    const content = this.insertedBookmark.content;

    const startOffset =
      this._editorContainer.documentEditor.selection.startOffset.split(";");

    //add 2 positions so as not to select [ or <
    startOffset[2] = String(
      Number(
        this._editorContainer.documentEditor.selection.startOffset.split(";")[2]
      ) +
        (title.length + 3)
    );
    const start = startOffset.join(";");

    const endOffset =
      this._editorContainer.documentEditor.selection.endOffset.split(";");
    //remove the content size plus 2 positions so as not to select > or ]
    endOffset[2] = String(Number(start.split(";")[2]) + content.length);
    const end = endOffset.join(";");

    this._editorContainer.documentEditor.selection.select(start, end);
  }

  selectTitleField(content: string): void {
    const startOffset =
      this._editorContainer.documentEditor.selection.startOffset.split(";");
    //add 2 positions so as not to select [ or <
    startOffset[2] = String(
      Number(
        this._editorContainer.documentEditor.selection.startOffset.split(";")[2]
      ) + 2
    );
    const start = startOffset.join(";");

    const endOffset =
      this._editorContainer.documentEditor.selection.endOffset.split(";");
    //remove the content size plus 2 positions so as not to select > or ]
    endOffset[2] = String(
      Number(
        this._editorContainer.documentEditor.selection.endOffset.split(";")[2]
      ) -
        (content.length + 2)
    );
    const end = endOffset.join(";");
    this._editorContainer.documentEditor.selection.select(start, end);
  }

  sortByPosition(): void {
    this._bookmarks.sort(
      (
        currentOffset: { offset: { start: string; end: string } },
        nextOffset: { offset: { start: string; end: string } }
      ) => {
        const current = currentOffset.offset.start.split(";").map(Number);
        const next = nextOffset.offset.start.split(";").map(Number);
        return (
          current[0] - next[0] || current[1] - next[1] || current[2] - next[2]
        );
      }
    );
  }

  getNames(bookmarkContent: string): {
    title: string;
    content: string;
  } {
    let title = "";
    let content = "";
    if (bookmarkContent.includes("[")) {
      title = bookmarkContent
        .split(">")[0]
        .replace(/[^a-zA-Z0-9]/g, " ")
        .trimStart();
      content = bookmarkContent
        .split(">")[1]
        .replace(/[^a-zA-Z0-9]/g, " ")
        .trimEnd();
    } else {
      content = bookmarkContent;
    }
    return {
      title,
      content,
    };
  }

  popAndUpdate(bookmarkName: string, content: string, title: string): void {
    const index = this._bookmarks.findIndex(item => item.name === bookmarkName);
    if (index !== -1) {
      this._bookmarks = this._bookmarks.map(item => {
        if (item.name === bookmarkName) {
          return {
            name: bookmarkName,
            content,
            title,
            offset: {
              start: this._editorContainer.documentEditor.selection.startOffset,
              end: this._editorContainer.documentEditor.selection.endOffset,
            },
          };
        }
        return item;
      });
    } else {
      this._bookmarks = [
        ...this._bookmarks,
        {
          name: bookmarkName,
          content,
          title,
          offset: {
            start: this._editorContainer.documentEditor.selection.startOffset,
            end: this._editorContainer.documentEditor.selection.endOffset,
          },
        },
      ];
    }
  }

  removeEmptyField(): void {
    this._bookmarks = this._bookmarks.filter(item => item.content !== "");
  }

  getPreviousAndNext(currentOffset: { start: string; end: string }): void {
    const index = this._bookmarks.findIndex(
      bookmark => this.findCurrentIndex(currentOffset, bookmark.offset) < 0
    );

    const previousIndex = index <= 0 ? this._bookmarks.length - 1 : index - 1;

    let previousField =
      index <= 0
        ? this._bookmarks[previousIndex]
        : this._bookmarks[previousIndex];

    const nextField =
      index === -1 ? this._bookmarks[0] : this._bookmarks[index];

    previousField = this.checkIsSelectedAndUpdatePrevious(previousIndex);
    this.previousBookmark = previousField;
    this.nextBookmark = nextField;
  }

  findCurrentIndex(
    bookmark: { start: string; end: string },
    currentOffset: { start: string; end: string }
  ): number {
    const bookmarkOffsetStart = bookmark.start.split(";").map(Number);
    const currentOffsetStart = currentOffset.start.split(";").map(Number);
    const bookmarkOffsetEnd = bookmark.end.split(";").map(Number);
    const currentOffsetEnd = currentOffset.end.split(";").map(Number);
    for (let i = 0; i < bookmarkOffsetStart.length; i++) {
      if (bookmarkOffsetStart[i] !== currentOffsetStart[i]) {
        return bookmarkOffsetStart[i] - currentOffsetStart[i];
      }
    }
    for (let i = 0; i < bookmarkOffsetEnd.length; i++) {
      if (bookmarkOffsetEnd[i] !== currentOffsetEnd[i]) {
        return bookmarkOffsetEnd[i] - currentOffsetEnd[i];
      }
    }
    return 0;
  }

  checkIsSelectedAndUpdatePrevious(previousIndex: number): IaraBookmark {
    let selected = this._bookmarks[previousIndex];

    const compareCurrentOffsetWithPreviousOffset =
      this.currentSelectionOffset.start &&
      this.currentSelectionOffset.start ===
        this.previousBookmark.offset.start &&
      this.previousBookmark.offset.end === this.currentSelectionOffset.end;

    const compareCurrentOffsetWithNextOffset =
      this.currentSelectionOffset.start &&
      this.currentSelectionOffset.start === this.nextBookmark.offset.start &&
      this.currentSelectionOffset.end === this.nextBookmark.offset.end;

    const compareCurrentOffsetWithSelecteOffset =
      this.previousBookmark.offset.start &&
      this.previousBookmark.content !== selected.content;

    console.log(selected.content, this.previousBookmark.content);
    console.log(
      "PREVIOUS",
      compareCurrentOffsetWithPreviousOffset,
      "NEXT",
      compareCurrentOffsetWithNextOffset,
      "SELECTED",
      compareCurrentOffsetWithSelecteOffset
    );
    if (
      compareCurrentOffsetWithPreviousOffset ||
      compareCurrentOffsetWithNextOffset ||
      compareCurrentOffsetWithSelecteOffset
    ) {
      selected = this._bookmarks[previousIndex - 1];
      return previousIndex <= 0
        ? this._bookmarks[this._bookmarks.length - 1]
        : this._bookmarks[previousIndex - 1];
    }
    console.log(selected, this.previousBookmark);
    return this._bookmarks[previousIndex];
  }

  getOffsets(name: string, excludeBookmarkStartEnd?: boolean): void {
    const bookmarks: Dictionary<string, BookmarkElementBox> =
      this._editorContainer.documentEditor.documentHelper.bookmarks;
    if (bookmarks.containsKey(name)) {
      //bookmark start element
      const bookmrkElmnt: BookmarkElementBox = bookmarks.get(name);

      let offset: number = bookmrkElmnt.line.getOffset(bookmrkElmnt, 0);

      if (excludeBookmarkStartEnd) {
        offset++;
      }

      const startPosition: TextPosition = new TextPosition(
        this._editorContainer.documentEditor
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
      const endPosition: TextPosition = new TextPosition(
        this._editorContainer.documentEditor
      );
      endPosition.setPositionParagraph(bookmrkEnd.line, endoffset);
      //selects the bookmark range
      this._editorContainer.documentEditor.documentHelper.selection.selectRange(
        startPosition,
        endPosition
      );
    }
  }
}
