import {
  BookmarkElementBox,
  Dictionary,
  DocumentEditor,
  TextPosition,
} from "@syncfusion/ej2-documenteditor";
import { IaraSyncfusionConfig } from "..";
import { IaraEditorNavigationFieldManager } from "../../editor/navigationFields";
import { IaraBookmark } from "./bookmark";

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

  private _previousBookmarksTitles: string[] = [];

  constructor(
    private _documentEditor: DocumentEditor,
    private _config: IaraSyncfusionConfig
  ) {
    super();
    const navigationBtn = <HTMLElement>(
      document.getElementById("navigation_fields")
    );

    if (!navigationBtn) return;

    navigationBtn.addEventListener("click", () => {
      const insertBtn = <HTMLElement>document.getElementById("add_field");
      const nextFieldBtn = <HTMLElement>document.getElementById("next_field");
      const previousFieldBtn = <HTMLElement>(
        document.getElementById("previous_field")
      );
      const insertMandatoryFieldBtn = <HTMLElement>(
        document.getElementById("add_mandatory_field")
      );
      const insertOptionalFieldBtn = <HTMLElement>(
        document.getElementById("add_optional_field")
      );

      const selectedText = this._documentEditor.selection.text
        ? this._documentEditor.selection.text.trim()
        : undefined;

      insertBtn.addEventListener("click", () => {
        this.insertField(selectedText);
      });
      insertMandatoryFieldBtn.addEventListener("click", () => {
        this.insertMandatoryField(selectedText);
      });
      insertOptionalFieldBtn.addEventListener("click", () => {
        this.insertOptionalField(selectedText);
      });
      nextFieldBtn.addEventListener("click", () => {
        this.nextField();
      });
      previousFieldBtn.addEventListener("click", () => {
        this.previousField();
      });
    });
  }

  insertField(content = "Escreva uma dica de texto"): void {
    const bookmarksCount = Date.now();
    this._documentEditor.editor.insertBookmark(`Field-${bookmarksCount}`);
    const title = "Nome do campo";
    this._documentEditor.editor.insertText("[]");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText("<>");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText(`${title}`);
    this._documentEditor.selection.clear();
    this._documentEditor.selection.moveNextPosition();
    this._documentEditor.editor.insertText(content);
    this.getBookmarks();
    this.isFirstNextNavigation = true;
    this.isFirstPreviousNavigation = true;
    this.getOffsetsAndSelect(`Field-${bookmarksCount}`, true);
    this.selectTitle(title, `Field-${bookmarksCount}`);
  }

  insertMandatoryField(content = "Escreva uma dica de texto"): void {
    const bookmarksCount = Date.now();
    this._documentEditor.editor.insertBookmark(`Mandatory-${bookmarksCount}`);
    const title = "Nome do campo";
    this._documentEditor.editor.insertText("[]");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText("<>");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText(`${title}`);
    this._documentEditor.selection.clear();
    this._documentEditor.selection.moveNextPosition();
    this._documentEditor.editor.insertText(`${content}*`);
    this.getBookmarks();
    this.isFirstNextNavigation = true;
    this.isFirstPreviousNavigation = true;
    this.getOffsetsAndSelect(`Mandatory-${bookmarksCount}`, true);
    this.selectTitle(title, `Mandatory-${bookmarksCount}`);
  }

  insertOptionalField(content = "Escreva uma dica de texto"): void {
    const bookmarksCount = Date.now();
    this._documentEditor.editor.insertBookmark(`Optional-${bookmarksCount}`);
    const title = "Nome do campo";
    this._documentEditor.editor.insertText("[]");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText("<>");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText(`${title}`);
    this._documentEditor.selection.clear();
    this._documentEditor.selection.moveNextPosition();
    this._documentEditor.editor.insertText(`${content}?`);
    this.getBookmarks();
    this.isFirstNextNavigation = true;
    this.isFirstPreviousNavigation = true;
    this.getOffsetsAndSelect(`Optional-${bookmarksCount}`, true);
    this.selectTitle(title, `Optional-${bookmarksCount}`);
  }

  getBookmarks(setColor = true): void {
    const editorBookmarks = this._documentEditor.getBookmarks();
    this.updateBookmark(editorBookmarks);
    this.removeEmptyField(editorBookmarks);
    if (this.isFirstNextNavigation || this.isFirstPreviousNavigation) {
      this.insertedBookmark = this._bookmarks.filter(
        bookmark =>
          bookmark.name === editorBookmarks[editorBookmarks.length - 1]
      )[0];
    }
    this.sortByPosition();
    if (this._bookmarks.length > 1)
      this.getPreviousAndNext(this.currentSelectionOffset);

    if (setColor) this.setColor();

    this._documentEditor.selection.clear();
  }

  goToField(title: string): void | string {
    this._previousBookmarksTitles = [...this._previousBookmarksTitles, title];
    const bookmarks = this._bookmarks.filter(
      bookmark =>
        bookmark.title.toLowerCase() === title.toLowerCase() &&
        bookmark.title !== "Nome do campo" &&
        bookmark.title !== ""
    );
    if (bookmarks.length === 1) {
      this.getOffsetsAndSelect(bookmarks[0].name);
      this._previousBookmarksTitles = [];
    } else if (bookmarks.length > 1) {
      this.getOffsetsAndSelect(
        bookmarks[this._previousBookmarksTitles.length - 1].name
      );
    } else throw new Error("Method not implemented.");
  }

  nextField(isShortcutNavigation?: boolean): void {
    this.currentSelectionOffset = {
      start: this._documentEditor.selection.startOffset,
      end: this._documentEditor.selection.endOffset,
    };
    this.getBookmarks(false);

    if (isShortcutNavigation && this.isFirstNextNavigation)
      this.selectContent(
        this.insertedBookmark.title,
        this.insertedBookmark.content,
        this.insertedBookmark.name
      );
    else {
      this.getOffsetsAndSelect(this.nextBookmark.name);
    }
    this.isFirstNextNavigation = false;
    this.currentSelectionOffset = {
      start: this.nextBookmark.offset.start,
      end: this.nextBookmark.offset.end,
    };
  }

  previousField(isShortcutNavigation?: boolean): void {
    this.currentSelectionOffset = {
      start: this._documentEditor.selection.startOffset,
      end: this._documentEditor.selection.endOffset,
    };

    this.getBookmarks(false);

    if (isShortcutNavigation && this.isFirstPreviousNavigation)
      this.selectTitle(this.insertedBookmark.title, this.insertedBookmark.name);
    else {
      this.getOffsetsAndSelect(this.previousBookmark.name);
    }
    this.isFirstPreviousNavigation = false;
    this.currentSelectionOffset = {
      start: this.previousBookmark.offset.start,
      end: this.previousBookmark.offset.end,
    };
  }

  selectContent(title: string, content: string, bookmarkName: string): void {
    this.getOffsetsAndSelect(bookmarkName, true);
    this._documentEditor.selection.select(
      this._documentEditor.selection.startOffset,
      this._documentEditor.selection.startOffset
    );
    const startOffset = this._documentEditor.selection.startOffset.split(";");

    //title lenght and add 3 positions to pass startOffset to content
    startOffset[2] = String(
      Number(this._documentEditor.selection.startOffset.split(";")[2]) +
        (title.length + 3)
    );
    const start = startOffset.join(";");

    const endOffset = this._documentEditor.selection.endOffset.split(";");
    //add content lenght to endOffset to pass endOffset to content
    endOffset[2] = String(Number(start.split(";")[2]) + content.length);
    const end = endOffset.join(";");

    this._documentEditor.selection.select(start, end);
  }

  selectTitle(
    title: string,
    bookmarkName: string,
    selectAllTitle?: boolean
  ): void {
    this.getOffsetsAndSelect(bookmarkName, true);
    this._documentEditor.selection.select(
      this._documentEditor.selection.startOffset,
      this._documentEditor.selection.startOffset
    );
    const startOffset = this._documentEditor.selection.startOffset.split(";");
    //add 2 positions so as not to select [ or <
    startOffset[2] = String(
      selectAllTitle
        ? Number(this._documentEditor.selection.startOffset.split(";")[2]) + 1
        : Number(this._documentEditor.selection.startOffset.split(";")[2]) + 2
    );
    const start = startOffset.join(";");

    const endOffset = this._documentEditor.selection.endOffset.split(";");
    //remove the content size plus 2 positions so as not to select > or ]
    endOffset[2] = String(
      selectAllTitle
        ? Number(this._documentEditor.selection.endOffset.split(";")[2]) +
            (title.length + 3)
        : Number(this._documentEditor.selection.endOffset.split(";")[2]) +
            (title.length + 2)
    );
    const end = endOffset.join(";");
    this._documentEditor.selection.select(start, end);
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

  getTitleAndContent(bookmarkContent: string): {
    title: string;
    content: string;
  } {
    let title = "";
    let content = "";
    if (bookmarkContent.includes("[")) {
      const insideContent = bookmarkContent.replace(
        /\[(.*)\]/,
        (_match, group1) => group1
      );
      title = insideContent.split(">")[0].substring(1);
      content = insideContent.split(">")[1];
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
    if (
      bookmarkName.includes("Field") ||
      bookmarkName.includes("Mandatory") ||
      bookmarkName.includes("Optional")
    ) {
      if (index !== -1) {
        this._bookmarks = this._bookmarks.map(item => {
          if (item.name === bookmarkName) {
            return {
              name: bookmarkName,
              content,
              title,
              offset: {
                start: this._documentEditor.selection.startOffset,
                end: this._documentEditor.selection.endOffset,
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
              start: this._documentEditor.selection.startOffset,
              end: this._documentEditor.selection.endOffset,
            },
          },
        ];
      }
    }
  }

  setColor() {
    this._bookmarks.map(bookmark => {
      this._documentEditor.selection.select(
        bookmark.offset.start,
        bookmark.offset.end
      );
      if (bookmark.name.includes("Mandatory")) {
        this._config.darkMode
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#6C4E35")
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#FFD5BB");
        this.selectTitle(bookmark.title, bookmark.name, true);
        this._config.darkMode
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#C07240")
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#FFEBD8");
        this.selectContent(bookmark.title, bookmark.content, bookmark.name);
        this._config.darkMode
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#6C4E35")
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#FFD5BB");
      }
      if (bookmark.name.includes("Field")) {
        this._config.darkMode
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#565656")
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#DDDDDD");
        this.selectTitle(bookmark.title, bookmark.name, true);
        this._config.darkMode
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#3F3F3F")
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#AEAEAE");
        this.selectContent(bookmark.title, bookmark.content, bookmark.name);
        this._config.darkMode
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#565656")
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#DDDDDD");
      }
      if (bookmark.name.includes("Optional")) {
        this._config.darkMode
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#4C83AC")
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#CEEFFE");
        this.selectTitle(bookmark.title, bookmark.name, true);
        this._config.darkMode
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#356688")
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#BAE1FE");
        this.selectContent(bookmark.title, bookmark.content, bookmark.name);
        this._config.darkMode
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#4C83AC")
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (this._documentEditor.selection.characterFormat.highlightColor =
              "#CEEFFE");
      }
    });
  }

  updateBookmark(editorBookmarks: string[]): void {
    editorBookmarks.map(bookmark => {
      this.getOffsetsAndSelect(bookmark);
      const bookmarkContent = this._documentEditor.selection.text;
      const { title, content } = this.getTitleAndContent(bookmarkContent);
      this.popAndUpdate(bookmark, content, title);
    });
  }

  removeEmptyField(editorBookmarks: string[]): void {
    this._bookmarks = this._bookmarks.filter(item =>
      editorBookmarks.includes(item.name)
    );
    this._bookmarks = this._bookmarks.filter(bookmark => bookmark.title);
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
    return this._bookmarks[previousIndex];
  }

  getOffsetsAndSelect(name: string, excludeBookmarkStartEnd?: boolean): void {
    const bookmarks: Dictionary<string, BookmarkElementBox> =
      this._documentEditor.documentHelper.bookmarks;

    if (bookmarks.containsKey(name)) {
      //bookmark start element
      const bookmrkElmnt: BookmarkElementBox = bookmarks.get(name);

      let offset: number = bookmrkElmnt.line.getOffset(bookmrkElmnt, 0);

      if (excludeBookmarkStartEnd) {
        offset++;
      }

      const startPosition: TextPosition = new TextPosition(
        this._documentEditor
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
      const endPosition: TextPosition = new TextPosition(this._documentEditor);
      endPosition.setPositionParagraph(bookmrkEnd.line, endoffset);
      //selects the bookmark range
      this._documentEditor.documentHelper.selection.selectRange(
        startPosition,
        endPosition
      );
    }
  }

  clearReportToCopyContent(): void {
    this.getBookmarks(false);
    this._bookmarks.filter(field => {
      this.getOffsetsAndSelect(field.name);
      if (field.name.includes("Field")) {
        if (field.content && field.content !== "Escreva uma dica de texto") {
          this._documentEditor.editor.insertText(field.content);
          this._documentEditor.editor.deleteBookmark(field.name);
        } else {
          this._documentEditor.editor.delete();
          this._documentEditor.editor.onBackSpace();
          this._documentEditor.editor.deleteBookmark(field.name);
        }
      }
      if (field.name.includes("Optional")) {
        if (field.title) {
          this._documentEditor.editor.delete();
          this._documentEditor.editor.onBackSpace();
          this._documentEditor.editor.deleteBookmark(field.name);
        }
      }
    });
  }

  requiredFields(): boolean {
    this.getBookmarks(false);
    const mandatoriesFields = this._bookmarks.filter(
      bookmark => bookmark.name.includes("Mandatory") && bookmark.title
    );
    if (mandatoriesFields.length) {
      if (mandatoriesFields[0].title) {
        this.getOffsetsAndSelect(mandatoriesFields[0].name);
      }
      return true;
    }
    return false;
  }

  hasEmptyRequiredFields(): boolean {
    if (!this.requiredFields()) {
      this.clearReportToCopyContent();
    }
    return this.requiredFields();
  }
}
