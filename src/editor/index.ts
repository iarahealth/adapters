import { IaraInference } from "../speech";

export abstract class EditorAdapter {
  constructor(protected _editor: any, protected _recognition: any) {
    _recognition.addEventListener(
      "iaraSpeechRecognitionResult",
      (event: { detail: IaraInference }) => {
        this.insertInference(event.detail);
      }
    )
    _recognition.addEventListener(
      "iaraSpeechRecognitionStart",
      () => {
        this.blockEditorWhileSpeaking(true)
      }
    )
    _recognition.addEventListener(
      "iaraSpeechRecognitionStop",
      () => {
        this.blockEditorWhileSpeaking(false)
      }
    )
    // VAD Events
    _recognition.addEventListener(
      "iaraSpeechRecognitionVADVoiceStart",
      () => {
        this.blockEditorWhileSpeaking(true)
      }
    )
    _recognition.addEventListener(
      "iaraSpeechRecognitionVADVoiceStop",
      () => {
        this.blockEditorWhileSpeaking(false)
      }
    )
  }

  abstract insertInference(inference: IaraInference): void;
  abstract blockEditorWhileSpeaking(status: any): void;

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
