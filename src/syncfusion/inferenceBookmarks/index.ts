import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { v4 as uuidv4 } from "uuid";
import type {
  IaraSpeechRecognition,
  IaraSpeechRecognitionDetail,
} from "../../speech";
import { IaraSyncfusionSelectionManager } from "../selection";

export interface IaraInferenceBookmark {
  content: string;
  inferenceId?: string;
  inferenceText?: string;
  name: string;
  recordingId?: string;
}

export class IaraSyncfusionInferenceBookmarksManager {
  private _bookmarks: Record<string, IaraInferenceBookmark> = {};
  public get bookmarks(): Record<string, IaraInferenceBookmark> {
    return this._bookmarks;
  }

  private readonly _listeners: {
    key: string;
    callback: (
      event:
        | CustomEvent<{ recordingId: string; inferenceId: string }>
        | undefined
    ) => void;
  }[] = [
    {
      key: "iaraOggFileUploaded",
      callback: (
        event:
          | CustomEvent<{ recordingId: string; inferenceId: string }>
          | undefined
      ) => {
        const detail = event?.detail;
        if (!detail) return;

        this._bookmarks[`inferenceId_${detail.inferenceId}`].recordingId =
          detail.recordingId;
      },
    },
  ];

  constructor(
    private readonly _documentEditor: DocumentEditor,
    private readonly _recognition: IaraSpeechRecognition
  ) {
    this._initListeners();
  }

  private _initListeners(): void {
    this._listeners.forEach(listener => {
      this._recognition.addEventListener(listener.key, listener.callback);
    });
  }

  private _updateBookmarkContent(bookmarkName: string): void {
    if (!(bookmarkName in this._bookmarks)) return;
    IaraSyncfusionSelectionManager.selectBookmark(
      this._documentEditor,
      bookmarkName,
      true
    );
    this._bookmarks[bookmarkName]["content"] =
      this._documentEditor.selection.text;
  }

  destroy(): void {
    this._listeners.forEach(listener => {
      this._recognition.removeEventListener(
        listener.key,
        listener.callback as EventListenerOrEventListenerObject
      );
    });
  }

  clearBookmarks(): void {
    this._bookmarks = {};
  }

  addBookmark(
    inference: IaraSpeechRecognitionDetail,
    bookmarkId?: string
  ): string {
    if (!bookmarkId) {
      bookmarkId = `inferenceId_${inference.inferenceId || uuidv4()}`;
      this._documentEditor.editor.insertBookmark(bookmarkId);
    }

    this._bookmarks[bookmarkId] = {
      content: "",
      inferenceId: inference.inferenceId,
      inferenceText: inference.richTranscript,
      name: bookmarkId,
    };
    return bookmarkId;
  }

  updateBookmarks(): void {
    const editorBookmarks = this._documentEditor.getBookmarks();
    editorBookmarks.forEach(bookmarkName => {
      this._updateBookmarkContent(bookmarkName);
    });
  }

  updateBookmarkInference(
    bookmarkName: string,
    inference: IaraSpeechRecognitionDetail
  ): void {
    if (!(bookmarkName in this._bookmarks)) return;

    const richTranscript = inference.richTranscript
      .replace(/^<div>[ ]*/, "")
      .replace(/[ ]*<\/div>$/, "")
      .replace(/[ ]*<\/div><div>[ ]*/g, "\n");
    this._bookmarks[bookmarkName]["inferenceText"] = richTranscript;
  }
}
