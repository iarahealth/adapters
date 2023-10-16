import { IaraInference } from "../speech";

export abstract class EditorAdapter {
  constructor(protected _editor: any, protected _recognition: any) {
    _recognition.commands.add('iara copiar laudo', () => {
      this.copyReport();
      alert('Laudo copiado para a área de transferência (CTRL + C)');
    });
    _recognition.commands.add('iara finalizar laudo', () => {
      this.finishReport();
      alert('Laudo copiado para a área de transferência (CTRL + C) e o editor de texto foi limpo.');
    });
    _recognition.commands.add('iara negrito', () => {
      this.editorToggleBold();
    });
    _recognition.commands.add('iara itálico', () => {
      this.editorToggleItalic();
    });
    _recognition.commands.add('iara sublinhado', () => {
      this.editorToggleUnderline();
    });
    _recognition.commands.add('iara maiúsculo', () => {
      this.editorToggleUppercase();
    });
    _recognition.addEventListener(
      "iaraSpeechRecognitionResult",
      (event: { detail: IaraInference }) => {
        this.insertInference(event.detail);
      }
    );
    _recognition.addEventListener("iaraSpeechRecognitionStart", () => {
      this.blockEditorWhileSpeaking(true);
    });
    _recognition.addEventListener("iaraSpeechRecognitionStop", () => {
      this.blockEditorWhileSpeaking(false);
    });
    // VAD Events
    _recognition.addEventListener("iaraSpeechRecognitionVADVoiceStart", () => {
      this.blockEditorWhileSpeaking(true);
    });
    _recognition.addEventListener("iaraSpeechRecognitionVADVoiceStop", () => {
      this.blockEditorWhileSpeaking(false);
    });
  }

  abstract insertInference(inference: IaraInference): void;
  abstract blockEditorWhileSpeaking(status: any): void;
  abstract copyReport(): void;
  abstract clearReport(): void;
  abstract setEditorFontFamily(fontName: string): void;
  abstract setEditorFontSize(fontSize: number): void;
  
  abstract editorToggleBold(): void;
  abstract editorToggleItalic(): void;
  abstract editorToggleUnderline(): void;
  abstract editorToggleUppercase(): void;

  beginReport(currentReportId?: string): void {
    if (currentReportId) return;
    return this._recognition.beginReport();
  }
  finishReport(): void {
    this.copyReport();
    this.clearReport();
    this._recognition.finishReport();
  }
  protected _onReportChanged(
    plainContent: string,
    richContent: string
  ): Promise<void> {
    return this._recognition.report.change(plainContent, richContent);
  }
}
