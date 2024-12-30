import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { v4 as uuidv4 } from "uuid";
import { IaraSyncfusionConfig } from "..";
import { IaraEditorNavigationFieldManager } from "../../editor/navigationFields";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionLanguageManager } from "../language";
import { IaraSyncfusionSelectionManager } from "../selection";
import { IaraSyncfusionAdditiveDialog } from "./additive.ts/dialog";
import { IaraSyncfusionAdditiveList } from "./additive.ts/list";
import {
  IaraAdditiveBookmark,
  IaraNavigationBookmark,
} from "./navigationBookmark";

export class IaraSyncfusionNavigationFieldManager extends IaraEditorNavigationFieldManager {
  additiveListIntance: IaraSyncfusionAdditiveList | null = null;
  additiveIdList: string[] = [];
  additiveBookmark: IaraAdditiveBookmark = {
    title: "",
    delimiterStart: "",
    delimiterEnd: "",
    additiveTexts: [
      {
        identifier: "",
        phrase: "",
      },
    ],
  };
  blockSelectionInBookmarkCreate = false;
  bookmarks: IaraNavigationBookmark[] = [];
  currentSelectionOffset: {
    start: string;
    end: string;
  } = {
    start: "",
    end: "",
  };
  insertedBookmark: IaraNavigationBookmark = {
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
  nextBookmark: IaraNavigationBookmark = {} as IaraNavigationBookmark;
  previousBookmark: IaraNavigationBookmark = {} as IaraNavigationBookmark;

  private _previousBookmarksTitles: string[] = [];
  constructor(
    public _documentEditor: DocumentEditor,
    private _config: IaraSyncfusionConfig,
    _recognition: IaraSpeechRecognition,
    private _languageManager: IaraSyncfusionLanguageManager
  ) {
    super(_recognition);

    this.previousBookmark = {
      name: "",
      content: "",
      title: "",
      offset: {
        start: "",
        end: "",
      },
    };
    this.nextBookmark = {
      name: "",
      content: "",
      title: "",
      offset: {
        start: "",
        end: "",
      },
    };
    this.additiveListIntance = new IaraSyncfusionAdditiveList(this);
  }

  addAdditiveField() {
    new IaraSyncfusionAdditiveDialog(this._languageManager, this);
  }

  createBookmarks(setColor = true): void {
    const editorBookmarks = this._documentEditor.getBookmarks();
    this.updateBookmark(editorBookmarks);
    this.removeEmptyField(editorBookmarks);
    this.sortByPosition();

    if (setColor) this.setColor();

    this._documentEditor.selection.clear();
  }

  insertAdditiveField(additive: IaraAdditiveBookmark) {
    this.blockSelectionInBookmarkCreate = false;
    const bookmarksCount = uuidv4();
    this._documentEditor.editor.insertText(" ");
    this._documentEditor.editor.onBackSpace();
    this._documentEditor.editor.insertBookmark(`Additive-${bookmarksCount}`);
    this._documentEditor.editor.insertText("[]");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText("<>");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText(additive.title);
    this._documentEditor.selection.clear();
    this._documentEditor.selection.moveNextPosition();
    this.additiveBookmark = additive;
    this.createBookmarks();
    this.blockSelectionInBookmarkCreate = true;
  }

  insertField(
    content = this._languageManager.languages.language.iaraTranslate
      .customfields.tipText.content,
    title = this._languageManager.languages.language.iaraTranslate.customfields
      .tipText.title,
    type: "Field" | "Mandatory" | "Optional" = "Field"
  ): void {
    this.blockSelectionInBookmarkCreate = false;
    const bookmarksCount = uuidv4();
    this._documentEditor.editor.insertText(" ");
    this._documentEditor.editor.onBackSpace();
    this._documentEditor.editor.insertBookmark(`${type}-${bookmarksCount}`);
    this._documentEditor.editor.insertText("[]");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText("<>");
    this._documentEditor.selection.movePreviousPosition();
    this._documentEditor.editor.insertText(title);
    this._documentEditor.selection.clear();
    this._documentEditor.selection.moveNextPosition();
    this._documentEditor.editor.insertText(content);
    if (type === "Mandatory") {
      if (!content.includes("*")) this._documentEditor.editor.insertText(`*`);
    }
    if (type === "Optional") {
      if (!content.includes("?")) this._documentEditor.editor.insertText(`?`);
    }
    this.createBookmarks();
    this.insertedBookmark = this.bookmarks.filter(
      bookmark => bookmark.name === `${type}-${bookmarksCount}`
    )[0];
    this.isFirstNextNavigation = true;
    this.isFirstPreviousNavigation = true;
    this.selectBookmark(`${type}-${bookmarksCount}`, true);
    this.selectTitle(title, `${type}-${bookmarksCount}`);
    this.blockSelectionInBookmarkCreate = true;
  }

  goToField(title: string): void | string {
    this._previousBookmarksTitles = [...this._previousBookmarksTitles, title];
    const bookmarks = this.bookmarks.filter(
      bookmark =>
        bookmark.title.toLowerCase() === title.toLowerCase() &&
        bookmark.title !== "Nome do campo" &&
        bookmark.title !== ""
    );
    if (bookmarks.length === 1) {
      this.selectBookmark(bookmarks[0].name);
      this._previousBookmarksTitles = [];
    } else if (bookmarks.length > 1) {
      this.selectBookmark(
        bookmarks[this._previousBookmarksTitles.length - 1].name
      );
    } else throw new Error("Method not implemented.");
  }

  nextField(isShortcutNavigation?: boolean): void {
    this.getPreviousAndNext(this.currentSelectionOffset);
    if (isShortcutNavigation && this.isFirstNextNavigation)
      this.selectContent(
        this.insertedBookmark.title,
        this.insertedBookmark.content,
        this.insertedBookmark.name
      );
    else this.selectBookmark(this.nextBookmark.name);
    this.isFirstNextNavigation = false;
    this.blockSelectionInBookmarkCreate = true;
    this._documentEditor.isReadOnly = false;
  }

  previousField(isShortcutNavigation?: boolean): void {
    this.getPreviousAndNext(this.currentSelectionOffset);
    if (isShortcutNavigation && this.isFirstPreviousNavigation)
      this.selectTitle(this.insertedBookmark.title, this.insertedBookmark.name);
    else this.selectBookmark(this.previousBookmark.name);
    this.isFirstPreviousNavigation = false;
    this.blockSelectionInBookmarkCreate = true;
    this._documentEditor.isReadOnly = false;
  }

  selectContent(title: string, content: string, bookmarkName: string): void {
    this.selectBookmark(bookmarkName, true);
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
    this.selectBookmark(bookmarkName, true);
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
    this.bookmarks.sort(
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
    const index = this.bookmarks.findIndex(item => item.name === bookmarkName);
    if (
      bookmarkName.includes("Field") ||
      bookmarkName.includes("Mandatory") ||
      bookmarkName.includes("Optional") ||
      bookmarkName.includes("Additive")
    ) {
      if (index !== -1) {
        this.bookmarks = this.bookmarks.map(item => {
          if (item.name === bookmarkName) {
            return {
              ...item,
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
        this.bookmarks = [
          ...this.bookmarks,
          {
            name: bookmarkName,
            content,
            title,
            offset: {
              start: this._documentEditor.selection.startOffset,
              end: this._documentEditor.selection.endOffset,
            },
            additive: bookmarkName.includes("Additive")
              ? this.additiveBookmark
              : undefined,
          },
        ];
      }
    }
  }

  setColor() {
    this.bookmarks.map(bookmark => {
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
      if (bookmark.name.includes("Additive")) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        this._documentEditor.selection.characterFormat.highlightColor =
          "#BAE1FE";
        this.selectTitle(bookmark.title, bookmark.name, true);
      }
    });
  }

  updateBookmark(editorBookmarks: string[]): void {
    editorBookmarks.map(bookmark => {
      this.selectBookmark(bookmark);
      const bookmarkContent = this._documentEditor.selection.text;
      const { title, content } = this.getTitleAndContent(bookmarkContent);
      this.popAndUpdate(bookmark, content, title);
    });
  }

  removeEmptyField(editorBookmarks: string[]): void {
    this.bookmarks = this.bookmarks.filter(item =>
      editorBookmarks.includes(item.name)
    );
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.title);
  }

  getPreviousAndNext(currentOffset: { start: string; end: string }): void {
    const editorBookmarks = this._documentEditor.getBookmarks();
    this.removeEmptyField(editorBookmarks);
    const index = this.bookmarks.findIndex(
      bookmark => this.findCurrentIndex(currentOffset, bookmark.offset) < 0
    );
    const previousIndex = index <= 0 ? this.bookmarks.length - 1 : index - 1;
    const nextField = index === -1 ? this.bookmarks[0] : this.bookmarks[index];
    const previousField = this.checkIsSelectedAndUpdatePrevious(previousIndex);

    this.previousBookmark = previousField
      ? previousField
      : {
          name: "",
          content: "",
          title: "",
          offset: {
            start: "",
            end: "",
          },
        };
    this.nextBookmark = nextField
      ? nextField
      : {
          name: "",
          content: "",
          title: "",
          offset: {
            start: "",
            end: "",
          },
        };
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

  checkIsSelectedAndUpdatePrevious(
    previousIndex: number
  ): IaraNavigationBookmark {
    const compareCurrentOffsetWithPreviousOffset =
      this.currentSelectionOffset.start &&
      this.currentSelectionOffset.start ===
        this.previousBookmark.offset.start &&
      this.previousBookmark.offset.end === this.currentSelectionOffset.end;

    const compareCurrentOffsetWithNextOffset =
      this.currentSelectionOffset.start &&
      this.currentSelectionOffset.start === this.nextBookmark.offset.start &&
      this.currentSelectionOffset.end === this.nextBookmark.offset.end;
    if (
      compareCurrentOffsetWithPreviousOffset ||
      compareCurrentOffsetWithNextOffset
    ) {
      return previousIndex <= 0
        ? this.bookmarks[this.bookmarks.length - 1]
        : this.bookmarks[previousIndex - 1];
    }
    return this.bookmarks[previousIndex];
  }

  clearReportToCopyContent(): void {
    this.additiveListIntance?.hide();
    this.createBookmarks(false);
    this.bookmarks.filter(field => {
      this.selectBookmark(field.name);
      if (field.name.includes("Field")) {
        if (field.content && field.content !== "Escreva uma dica de texto") {
          this._documentEditor.editor.insertText(field.content);
          this._documentEditor.editor.deleteBookmark(field.name);
        } else {
          this._documentEditor.editor.deleteBookmark(field.name);
          this._documentEditor.editor.delete();
        }
      }
      if (field.name.includes("Optional")) {
        if (field.title) {
          this._documentEditor.editor.deleteBookmark(field.name);
          this._documentEditor.editor.delete();
        }
      }
    });
  }

  hasEmptyRequiredFields(): boolean {
    this.createBookmarks(false);
    const mandatoriesFields = this.bookmarks.filter(
      bookmark => bookmark.name.includes("Mandatory") && bookmark.title
    );
    if (mandatoriesFields.length) {
      if (mandatoriesFields[0].title) {
        this.selectBookmark(mandatoriesFields[0].name);
      }
      return true;
    }
    return false;
  }

  showAdditiveList(): void {
    this.additiveListIntance = new IaraSyncfusionAdditiveList(this);
  }

  selectBookmark(bookmarkId: string, excludeBookmarkStartEnd?: boolean): void {
    IaraSyncfusionSelectionManager.selectBookmark(
      this._documentEditor,
      bookmarkId,
      excludeBookmarkStartEnd
    );
  }

  selectionChange = () => {
    if (
      this.blockSelectionInBookmarkCreate &&
      !this._documentEditor.isReadOnly
    ) {
      const selectionBookmark = this._documentEditor.selection.getBookmarks();
      const isAditiveField = selectionBookmark.find(bookmark =>
        bookmark.startsWith("Additive")
      );
      const currentAdditiveField = this.bookmarks.filter(
        bookmark => bookmark.name === selectionBookmark[0]
      );
      if (
        currentAdditiveField.length &&
        currentAdditiveField[0].additive &&
        isAditiveField?.length
      ) {
        const additiveId = currentAdditiveField[0].name;
        const additiveField = currentAdditiveField[0].additive;
        this.additiveListIntance?.hide();
        if (this.additiveIdList.includes(additiveId)) {
          this.additiveListIntance?.show(additiveField, additiveId);
        } else {
          this.additiveListIntance?.create(additiveField, additiveId);
          this.additiveIdList = [...this.additiveIdList, additiveId];
        }
      } else this.additiveListIntance?.hide();
    }
    this.currentSelectionOffset = {
      start: this._documentEditor.selection.startOffset,
      end: this._documentEditor.selection.endOffset,
    };
  };
}
