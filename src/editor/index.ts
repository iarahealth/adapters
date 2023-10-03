import { IaraInference } from "../speech";

export abstract class EditorAdapter {
  constructor(protected _editor: any, protected _recognition: any) {
    _recognition.addEventListener(
      "iaraSpeechRecognitionResult",
      (event: { detail: IaraInference }) => {
        this.insertInference(event.detail);
      }
    );
    _recognition.addEventListener("iaraSpeechRecognitionStart", () => {
      this.blockEditorWhileSpeech(true);
    });
    _recognition.addEventListener("iaraSpeechRecognitionStop", () => {
      this.blockEditorWhileSpeech(false);
    });
    // VAD Events
    _recognition.addEventListener("iaraSpeechRecognitionVADVoiceStart", () => {
      this.blockEditorWhileSpeech(true);
    });
    _recognition.addEventListener("iaraSpeechRecognitionVADVoiceStop", () => {
      this.blockEditorWhileSpeech(false);
    });
  }

  abstract insertInference(inference: IaraInference): void;
  abstract blockEditorWhileSpeaking(status: any): void;

  beginReport(currentReportId?: string): void {
    if (currentReportId) return;
    return this._recognition.beginReport();
  }
  finishReport(): void {
    this._recognition.finishReport();
  }
  protected _onReportChanged(
    plainContent: string,
    richContent: string
  ): Promise<void> {
    return this._recognition.report.change(plainContent, richContent);
  }
}
