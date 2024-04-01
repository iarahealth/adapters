import {
  BookmarkElementBox,
  Dictionary,
  DocumentEditor,
  TextPosition,
} from "@syncfusion/ej2-documenteditor";
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

  constructor(private _documentEditor: DocumentEditor) {
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

      insertBtn.addEventListener("click", () => {
        this.insertField();
      });
      insertMandatoryFieldBtn.addEventListener("click", () => {
        this.insertMandatoryField();
      });
      insertOptionalFieldBtn.addEventListener("click", () => {
        this.insertOptionalField();
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
    this._documentEditor.editor.insertBookmark(`Field-${bookmarksCount}`);
    const content = "Escreva uma dica de texto";
    const title = "Nome do campo";
    this._documentEditor.editor.insertText("[]");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText("<>");
    this._documentEditor.selection.movePreviousPosition();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this._documentEditor.selection.characterFormat.highlightColor = "#9e9ef4";
    this._documentEditor.editor.insertText(`${title}`);
    this._documentEditor.selection.clear();
    this._documentEditor.selection.moveNextPosition();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this._documentEditor.selection.characterFormat.highlightColor = "#c0beff";
    this._documentEditor.editor.insertText(`${content}`);
    this._documentEditor.selection.selectBookmark(
      `Field-${bookmarksCount}`,
      true
    );
    this.getBookmarks();
    this.isFirstNextNavigation = true;
    this.isFirstPreviousNavigation = true;
    this.selectTitleField(content);
  }

  insertMandatoryField(): void {
    const bookmarksCount = Date.now();

    const defaultColor =
      this._documentEditor.selection.characterFormat.fontColor;

    this._documentEditor.editor.insertBookmark(`Mandatory-${bookmarksCount}`);
    const content = "Escreva uma dica de texto";
    const title = "Nome do campo";
    this._documentEditor.selection.characterFormat.fontColor = "#b71c1c";
    this._documentEditor.editor.insertText("[]");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.selection.characterFormat.fontColor = "#ffd54f";
    this._documentEditor.editor.insertText("*");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.selection.characterFormat.fontColor = `${defaultColor}`;
    this._documentEditor.editor.insertText("<>");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText(`${title}`);
    this._documentEditor.selection.clear();
    this._documentEditor.selection.moveNextPosition();
    this._documentEditor.editor.insertText(`${content}`);
    this._documentEditor.selection.selectBookmark(
      `Mandatory-${bookmarksCount}`,
      true
    );
    this.getBookmarks();
    this.isFirstNextNavigation = true;
    this.isFirstPreviousNavigation = true;
    this.selectTitleField(`${content}*`);
  }

  insertOptionalField(): void {
    const bookmarksCount = Date.now();

    const defaultColor =
      this._documentEditor.selection.characterFormat.fontColor;

    this._documentEditor.editor.insertBookmark(`Optional-${bookmarksCount}`);
    const content = "Escreva uma dica de texto";
    const title = "Nome do campo";
    this._documentEditor.selection.characterFormat.fontColor = "#3269a8";
    this._documentEditor.editor.insertText("[]");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.selection.characterFormat.fontColor = "#ffd54f";
    this._documentEditor.editor.insertText("?");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.selection.characterFormat.fontColor = `${defaultColor}`;
    this._documentEditor.editor.insertText("<>");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText(`${title}`);
    this._documentEditor.selection.clear();
    this._documentEditor.selection.moveNextPosition();
    this._documentEditor.editor.insertText(`${content}`);
    this._documentEditor.selection.selectBookmark(
      `Optional-${bookmarksCount}`,
      true
    );
    this.getBookmarks();
    this.isFirstNextNavigation = true;
    this.isFirstPreviousNavigation = true;
    this.selectTitleField(`${content}*`);
  }

  getBookmarks(): void {
    const editorBookmarks = this._documentEditor.getBookmarks();
    editorBookmarks.map(bookmark => {
      this.getOffsetsAndSelect(bookmark, true);
      const bookmarkContent = this._documentEditor.selection.text;

      const { title, content } = this.getNames(bookmarkContent);

      this.popAndUpdate(bookmark, content, title);
      this._documentEditor.selection.clear();
    });
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
    console.log(editorBookmarks, this._bookmarks, "editorBookmarks");
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
      this.getOffsetsAndSelect(bookmarks[0].name, true);
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
    this.getBookmarks();

    if (isShortcutNavigation && this.isFirstNextNavigation)
      this.selectContentField();
    else {
      this._documentEditor.selection.select(
        this.nextBookmark.offset.start,
        this.nextBookmark.offset.end
      );
    }
    this.isFirstNextNavigation = false;
    this.currentSelectionOffset = {
      start: this.nextBookmark.offset.start,
      end: this.nextBookmark.offset.end,
    };

    this._documentEditor.selection.characterFormat.highlightColor = "Gray25";
  }

  previousField(isShortcutNavigation?: boolean): void {
    this.currentSelectionOffset = {
      start: this._documentEditor.selection.startOffset,
      end: this._documentEditor.selection.endOffset,
    };

    this.getBookmarks();

    if (isShortcutNavigation && this.isFirstPreviousNavigation)
      this.selectTitleField(this.insertedBookmark.content);
    else {
      this._documentEditor.selection.select(
        this.previousBookmark.offset.start,
        this.previousBookmark.offset.end
      );
    }
    this.isFirstPreviousNavigation = false;
    this.currentSelectionOffset = {
      start: this.previousBookmark.offset.start,
      end: this.previousBookmark.offset.end,
    };
    this._documentEditor.selection.characterFormat.highlightColor = "Gray25";
  }

  selectContentField(): void {
    const title = this.insertedBookmark.title;
    const content = this.insertedBookmark.content;
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

  selectTitleField(content: string): void {
    const startOffset = this._documentEditor.selection.startOffset.split(";");
    //add 2 positions so as not to select [ or <

    startOffset[2] = String(
      Number(this._documentEditor.selection.startOffset.split(";")[2]) + 2
    );
    const start = startOffset.join(";");

    const endOffset = this._documentEditor.selection.endOffset.split(";");
    //remove the content size plus 2 positions so as not to select > or ]
    endOffset[2] = String(
      Number(this._documentEditor.selection.endOffset.split(";")[2]) -
        (content.length + 2)
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

  getNames(bookmarkContent: string): {
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

  removeEmptyField(editorBookmarks: string[]): void {
    this._bookmarks = this._bookmarks.filter(item =>
      editorBookmarks.includes(item.name)
    );
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

  changeFieldsToFinishReport(): void {
    const fields = this._bookmarks.filter(bookmark =>
      bookmark.name.includes("Field")
    );
    fields.filter(field => {
      this.getOffsetsAndSelect(field.name);
      if (
        field.content === "" ||
        field.content === "Escreva uma dica de texto"
      ) {
        this._documentEditor.editor.insertText(" ");
        this._documentEditor.getBookmarks();
      } else {
        this._documentEditor.selection.characterFormat.highlightColor =
          "Violet";
        this._documentEditor.editor.insertText(`${field.content}`);
      }
      this._documentEditor.selection.clear();
    });
  }

  changeOptionalsFieldsToFinishReport(): void {
    const optionalFields = this._bookmarks.filter(bookmark =>
      bookmark.name.includes("Optional")
    );
    optionalFields.filter(field => {
      this.getOffsetsAndSelect(field.name);
      if (
        field.content === "" ||
        field.content === "Escreva uma dica de texto?"
      ) {
        this._documentEditor.editor.insertText(" ");
        this._documentEditor.getBookmarks();
      } else {
        this._documentEditor.editor.insertText(`${field.content}`);
      }
      this._documentEditor.selection.clear();
    });
  }

  changeMandatoriesFieldsToFinishReport(): void {
    const mandatoriesFields = this._bookmarks.filter(bookmark =>
      bookmark.name.includes("Mandatory")
    );
    mandatoriesFields.filter(field => {
      this.getOffsetsAndSelect(field.name);

      if (
        field.content !== "" &&
        field.content !== "Escreva uma dica de texto*"
      ) {
        this._documentEditor.selection.characterFormat.highlightColor = "Red";
        this._documentEditor.editor.insertText(`${field.content}`);
      }
      this._documentEditor.selection.clear();
    });
  }

  requiredFields(): boolean {
    this.getBookmarks();
    const mandatoriesFields = this._bookmarks.filter(bookmark =>
      bookmark.name.includes("Mandatory")
    );
    const hasMandatoriesFields = mandatoriesFields.filter(
      field =>
        field.content === "" || field.content === "Escreva uma dica de texto*"
    );
    return hasMandatoriesFields.length > 0 ? true : false;
  }

  hasEmptyRequiredFields(): boolean {
    console.log(this._bookmarks, "BOOKS");
    this.changeFieldsToFinishReport();
    this.changeOptionalsFieldsToFinishReport();
    this.changeMandatoriesFieldsToFinishReport();
    return this.requiredFields();
  }
}
