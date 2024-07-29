import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { v4 as uuidv4 } from "uuid";
import type {
  IaraSpeechRecognition,
  IaraSpeechRecognitionDetail,
} from "../../speech";
import { IaraSyncfusionSelectionManager } from "../selection";

export interface IaraInferenceBookmark {
  content: string;
  name: string;
  inferenceId?: string;
  recordingId?: string;
}

export class IaraSyncfusionInferenceBookmarksManager {
  private _bookmarks: Record<string, IaraInferenceBookmark> = {};
  public get bookmarks(): Record<string, IaraInferenceBookmark> {
    return this._bookmarks;
  }

  constructor(
    private _documentEditor: DocumentEditor,
    private _recognition: IaraSpeechRecognition
  ) {
    this._recognition.addEventListener("iaraOggFileUploaded", event => {
      const detail = event?.detail;
      if (!detail) return;

      this._bookmarks[`inferenceId_${detail.inferenceId}`].recordingId =
        detail.recordingId;
    });
  }

  private _updateBookmark(bookmarkName: string): void {
    if (!(bookmarkName in this._bookmarks)) return;
    IaraSyncfusionSelectionManager.selectBookmark(this._documentEditor, bookmarkName, true);
    this._bookmarks[bookmarkName]["content"] =
      this._documentEditor.selection.text;
  }

  clearBookmarks(): void {
    this._bookmarks = {};
  }

  addBookmark(inference: IaraSpeechRecognitionDetail, bookmarkId?: string): string {
    if (!bookmarkId) {
      bookmarkId = `inferenceId_${inference.inferenceId || uuidv4()}`;
      this._documentEditor.editor.insertBookmark(bookmarkId);
    }

    this._bookmarks[bookmarkId] = {
      content: "",
      name: bookmarkId,
      inferenceId: inference.inferenceId,
    };
    return bookmarkId;
  }

  updateBookmarks(): void {
    const editorBookmarks = this._documentEditor.getBookmarks();
    editorBookmarks.forEach(bookmarkName => {
      this._updateBookmark(bookmarkName);
    });
  }
}
