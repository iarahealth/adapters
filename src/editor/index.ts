import { IaraInference } from "../speech";

export abstract class EditorAdapter {
  constructor(protected _editor: any, protected _recognition: any) {
    _recognition.addEventListener(
      "iaraSpeechRecognitionResult",
      (event: { detail: IaraInference }) => {
        this.insertInference(event.detail);
      }
    );
  }

  abstract insertInference(inference: IaraInference): void;

  beginReport(currentReportId?: string): void {
    if (currentReportId) return;
    return this._recognition.beginReport();
  }
  finishReport(): void {
    this._recognition.finishReport();
  }
  protected _onReportChanged(content: string, html: string): Promise<void> {
    return this._recognition.report.change(content, html);
  }
}
