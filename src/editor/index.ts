import { IaraInference } from "../speech";

export abstract class EditorAdapter {
  constructor(protected _editor: any, protected _recognition: any) {
    _recognition
      .addEventListener(
        "iaraSpeechRecognitionResult",
        (event: { detail: IaraInference }) => {
          this.insertInference(event.detail);
        }
      )
    _recognition
      .addEventListener(
        "iaraSpeechRecognitionStart",
        () => {
          this.blockEditorWhileSpeech(true)
        }
      )
    _recognition
      .addEventListener(
        "iaraSpeechRecognitionStop",
        () => {
          this.blockEditorWhileSpeech(false)
        }
      )
  }

  abstract insertInference(inference: IaraInference): void;
  abstract blockEditorWhileSpeech(status: any): void;

  beginReport(): void {
    this._recognition.beginReport();
  }
  finishReport(): void {
    this._recognition.finishReport();
  }
  protected _onReportChanged(content: string[]): Promise<void> {
    return this._recognition.report.change(content[0], content[1]);
  }
}
