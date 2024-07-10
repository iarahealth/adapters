import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { v4 as uuidv4 } from "uuid";
import type {
  IaraSpeechRecognition,
  IaraSpeechRecognitionDetail,
} from "../../speech";

export interface IaraInferenceBookmark {
  content: string;
  name: string;
  inferenceId?: string;
  recordingId?: string;
}

export class IaraSyncfusionInferenceBookmarkManager {
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

  clearBookmarks(): void {
    this._bookmarks = {};
  }

  insertInferenceField(inference: IaraSpeechRecognitionDetail): string {
    const bookmarkId = `inferenceId_${inference.inferenceId || uuidv4()}`;
    this._documentEditor.editor.insertText(" ");
    this._documentEditor.editor.insertBookmark(bookmarkId);
    this._documentEditor.selection.movePreviousPosition();

    this._bookmarks[bookmarkId] = {
      content: "",
      name: bookmarkId,
      inferenceId: inference.inferenceId,
    };

    return bookmarkId;
  }

  refreshBookmark(bookmarkName: string): void {
    if (!(bookmarkName in this._bookmarks)) return;
    this._documentEditor.selection.selectBookmark(bookmarkName);
    this._bookmarks[bookmarkName]["content"] =
      this._documentEditor.selection.text;
  }

  refreshBookmarks(): void {
    const editorBookmarks = this._documentEditor.getBookmarks();
    editorBookmarks.forEach(bookmarkName => {
      this.refreshBookmark(bookmarkName);
    });
  }
}
