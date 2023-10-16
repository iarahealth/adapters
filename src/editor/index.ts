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
    this._recognition.finishReport();
  }
  protected _onReportChanged(
    plainContent: string,
    richContent: string
  ): Promise<void> {
    return this._recognition.report.change(plainContent, richContent);
  }
  _estimateVolume(text: string, regex: string) {
    let converted = false;
    const iterator = text.matchAll(RegExp(regex, 'giu'));
    const matches = [...iterator];
    
    matches.forEach((match) => {
      // Check if all desired groups were captured
      if (match && match.length === 7) {
        // Volume estimation given 3 elipsoid radius
        // original formula is: 4/3 * π * a * b * c
        // where a, b and c are elipsoid radius
        let volume =
          (4 / 3) *
          Math.PI *
          parseFloat(match[1].replace(',', '.')) *
          parseFloat(match[3].replace(',', '.')) *
          parseFloat(match[5].replace(',', '.'));

        // If user dictated measures as diameter
        // then each one must be converted to radius:
        // (4/3 * π * (a/2) * (b/2) * (c/2))
        
        // Volume estimation given 3 elipsoid radius
        volume /= 8;
        
        if (volume >= 1000 && match[6] == 'mm') {
          // convert the volume from mm³ to cm³
          volume /= 1000;
          converted = true;
        }
        // Round volume to 2 decimal places
        const estimation = `${
          Math.round(volume * Math.pow(10, 2)) / Math.pow(10, 2)
          }`.replace('.', ',');
        
        text = text.replace(
          match[0],
          `${match[0].replace('por', 'x')} (volume estimado em ${estimation} ${converted ? 'cm' : match[6]}${match[6] === 'cm'||match[6] === 'mm' ? '³': ''})`,
        );
      }
    });
    return text;
  }
}
