import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { v4 as uuidv4 } from "uuid";

export class IaraSyncfusionBookmarkManager {
  private _bookmarks: { name: string; content: string; inferenceId: string }[] =
    [];

  constructor(private _documentEditor: DocumentEditor) {}

  insertInferenceField(
    isFirstInference: boolean,
    isFinalInference: boolean
  ): void {
    if (isFirstInference) {
      this._documentEditor.editor.insertText(" ");
      this._documentEditor.editor.insertBookmark(`inferenceId_${uuidv4()}`);
      this._documentEditor.selection.movePreviousPosition();
    }
    if (isFinalInference) this.getBookmarks();
  }

  getBookmarks(): void {
    const editorBookmarks = this._documentEditor.getBookmarks();
    this.updateBookmark(editorBookmarks);
    this.removeEmptyField(editorBookmarks);
  }

  popAndUpdate(bookmarkName: string, content: string): void {
    const index = this._bookmarks.findIndex(item => item.name === bookmarkName);
    if (bookmarkName.includes("inferenceId")) {
      if (index !== -1) {
        this._bookmarks = this._bookmarks.map(item => {
          if (item.name === bookmarkName) {
            return {
              name: item.name,
              content: item.content,
              inferenceId: item.name.split("_")[1],
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
            inferenceId: bookmarkName.split("_")[1],
          },
        ];
      }
    }
  }

  removeEmptyField(editorBookmarks: string[]): void {
    this._bookmarks = this._bookmarks.filter(item =>
      editorBookmarks.includes(item.name)
    );
    this._bookmarks = this._bookmarks.filter(bookmark => bookmark.content);
  }

  updateBookmark(editorBookmarks: string[]): void {
    editorBookmarks.map(bookmark => {
      const content = this._documentEditor.selection.text;
      this.popAndUpdate(bookmark, content);
    });
  }
}
