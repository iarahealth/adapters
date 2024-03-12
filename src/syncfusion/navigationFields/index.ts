import {
  BookmarkElementBox,
  Dictionary,
  DocumentEditorContainer,
  TextPosition,
} from "@syncfusion/ej2-documenteditor";
import { IaraBookmark } from "./bookmark";

export class IaraSyncfusionNavigationFieldManager {
  currentCursorPosition: {
    start: string;
    end: string;
  } = { start: "", end: "" };
  currentNavigationIndex = 0;
  currentNavigationFieldName = "";
  isNavigationOnInsertField = false;

  private _bookmarks: IaraBookmark[] = [];

  constructor(private _editorContainer: DocumentEditorContainer) {
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
        this.navigationToNextField();
      });
      previousFieldBtn.addEventListener("click", () => {
        this.navigationToPreviousField();
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
    this.getBookmarksReport();
    this.isNavigationOnInsertField = true;
    this.selectTitleField(content);
  }

  getBookmarksReport(): void {
    const editorBookmarks = this._editorContainer.documentEditor.getBookmarks();
    editorBookmarks.map(bookmark => {
      this.getBookmarkPositionValue(bookmark);
      const bookmarkContent =
        this._editorContainer.documentEditor.selection.text;

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

      this.fieldExistChangeValue(bookmark, content, title);
      // this.removeFieldHidden(editorBookmarks);
    });
    this._editorContainer.documentEditor.selection.clear();
    this.sortByPosition();
  }

  navigationToNextField(): void {
    const currentPosition = {
      start: this._editorContainer.documentEditor.selection.startOffset,
      end: this._editorContainer.documentEditor.selection.endOffset,
    };
    this.getBookmarksReport();
    this.getCurrentNavigationPosition(currentPosition, "next");
    if (this.isNavigationOnInsertField) {
      this.selectContentFieldInNextPosition(
        this._bookmarks[this.currentNavigationIndex].title,
        this._bookmarks[this.currentNavigationIndex].content
      );
      this.isNavigationOnInsertField = false;
      return;
    }
    // this._editorContainer.documentEditor.selection.select(
    //   this._bookmarks[this.currentNavigationIndex].position.start,
    //   this._bookmarks[this.currentNavigationIndex].position.end
    // );
    this._editorContainer.documentEditor.selection.navigateBookmark(
      this.currentNavigationFieldName
    );
    this._editorContainer.documentEditor.selection.characterFormat.highlightColor =
      "Gray25";
  }

  navigationToPreviousField(): void {
    const currentPosition = {
      start: this._editorContainer.documentEditor.selection.startOffset,
      end: this._editorContainer.documentEditor.selection.endOffset,
    };
    this.getBookmarksReport();
    this.getCurrentNavigationPosition(currentPosition, "previous");

    this.currentNavigationIndex = this.currentNavigationIndex - 1;

    this._editorContainer.documentEditor.selection.navigateBookmark(
      this.currentNavigationFieldName
    );
    this._editorContainer.documentEditor.selection.characterFormat.highlightColor =
      "Gray25";
  }

  selectContentFieldInNextPosition(title: string, content: string): void {
    console.log(title, content);
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
        currentPostion: { position: { start: string; end: string } },
        nextPosition: { position: { start: string; end: string } }
      ) => {
        const current = currentPostion.position.start.split(";").map(Number);
        const next = nextPosition.position.start.split(";").map(Number);
        return (
          current[0] - next[0] || current[1] - next[1] || current[2] - next[2]
        );
      }
    );
  }

  fieldExistChangeValue(
    bookmarkName: string,
    content: string,
    title: string
  ): void {
    const index = this._bookmarks.findIndex(item => item.name === bookmarkName);
    if (index !== -1) {
      this._bookmarks = this._bookmarks.map(item => {
        if (item.name === bookmarkName) {
          return {
            name: bookmarkName,
            content,
            title,
            position: {
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
          position: {
            start: this._editorContainer.documentEditor.selection.startOffset,
            end: this._editorContainer.documentEditor.selection.endOffset,
          },
        },
      ];
    }
  }

  removeFieldHidden(editorBookmars: string[]): void {
    this._bookmarks = this._bookmarks.filter(item =>
      editorBookmars.includes(item.name)
    );
  }

  getCurrentNavigationPosition(
    currentPosition: {
      start: string;
      end: string;
    },
    nextOrPreviuos: string
  ): void {
    let position = this._bookmarks.findIndex(
      bookmark =>
        this.comparerCurrentPosition(currentPosition, bookmark.position) < 0
    );
    if (position === -1 && nextOrPreviuos === "next") position = 0;
    if (position === 0 && nextOrPreviuos === "previous")
      position = this._bookmarks.length;
    if (position === -1 && nextOrPreviuos === "previous")
      position = this._bookmarks.length - 1;

    this.currentNavigationIndex = position;
  }

  comparerCurrentPosition(
    bookmark: { start: string; end: string },
    currentPosition: { start: string; end: string }
  ): number {
    const bookmarkPositionStart = bookmark.start.split(";").map(Number);
    const currentPositionStart = currentPosition.start.split(";").map(Number);
    const bookmarkPositionEnd = bookmark.end.split(";").map(Number);
    const currentPositionEnd = currentPosition.end.split(";").map(Number);

    for (let i = 0; i < bookmarkPositionStart.length; i++) {
      if (bookmarkPositionStart[i] !== currentPositionStart[i]) {
        return bookmarkPositionStart[i] - currentPositionStart[i];
      }
    }

    for (let i = 0; i < bookmarkPositionEnd.length; i++) {
      if (bookmarkPositionEnd[i] !== currentPositionEnd[i]) {
        return bookmarkPositionEnd[i] - currentPositionEnd[i];
      }
    }

    return 0;
  }

  public getBookmarkPositionValue(name: string): void {
    const bookmarks: Dictionary<string, BookmarkElementBox> =
      this._editorContainer.documentEditor.documentHelper.bookmarks;
    if (bookmarks.containsKey(name)) {
      //bookmark start element
      const bookmrkElmnt: BookmarkElementBox = bookmarks.get(name);

      const offset: number = bookmrkElmnt.line.getOffset(bookmrkElmnt, 0);

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
      const endoffset: number = bookmrkEnd.line.getOffset(bookmrkEnd, 1);

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
