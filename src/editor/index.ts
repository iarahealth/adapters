import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import { Editor as TinymceEditor } from "tinymce";
import { IaraSpeechRecognition, IaraSpeechRecognitionDetail } from "../speech";
import { IaraEditorInferenceFormatter } from "./formatter";
import { IaraEditorStyleManager } from "./style";

export abstract class EditorAdapter {
  protected _inferenceFormatter: IaraEditorInferenceFormatter;
  protected abstract _styleManager: IaraEditorStyleManager;

  constructor(
    protected _editor: DocumentEditorContainer | TinymceEditor,
    protected _recognition: IaraSpeechRecognition
  ) {
    this._inferenceFormatter = new IaraEditorInferenceFormatter();
    this._initCommands();
    this._initListeners();
    this._recognition.internal.settings.replaceCommandActivationStringBeforeCallback =
      true;
  }

  abstract blockEditorWhileSpeaking(status: boolean): void;
  abstract clearReport(): void;
  abstract copyReport(): void;
  abstract insertInference(inference: IaraSpeechRecognitionDetail): void;
  abstract getEditorContent(): Promise<[string, string, string]>;

  beginReport(currentReportId?: string): string | void {
    if (currentReportId) return;
    return this._recognition.beginReport();
  }

  finishReport(clear = true): void {
    this.copyReport();
    if (clear) this.clearReport();
    this._recognition.finishReport();
  }

  private _initCommands(): void {
    this._recognition.commands.add("iara copiar laudo", () => {
      this.copyReport();
    });
    this._recognition.commands.add("iara finalizar laudo", () => {
      console.log("AQUINENNE");
      this.finishReport();
    });
    this._recognition.commands.add("iara negrito", () => {
      this._styleManager.toggleBold();
    });
    this._recognition.commands.add("iara itálico", () => {
      this._styleManager.toggleItalic();
    });
    this._recognition.commands.add("iara sublinhado", () => {
      this._styleManager.toggleUnderline();
    });
    this._recognition.commands.add("iara maiúsculo", () => {
      this._styleManager.toggleUppercase();
    });
  }

  private _initListeners(): void {
    this._recognition.addEventListener(
      "iaraSpeechRecognitionResult",
      (event?: CustomEvent<IaraSpeechRecognitionDetail>) => {
        if (event?.detail) this.insertInference(event.detail);
      }
    );
    this._recognition.addEventListener("iaraSpeechRecognitionStart", () => {
      this.blockEditorWhileSpeaking(true);
    });
    this._recognition.addEventListener("iaraSpeechRecognitionStop", () => {
      this.blockEditorWhileSpeaking(false);
    });
    this._recognition.addEventListener(
      "iaraSpeechRecognitionVADVoiceStart",
      () => {
        this.blockEditorWhileSpeaking(true);
      }
    );
    this._recognition.addEventListener(
      "iaraSpeechRecognitionVADVoiceStop",
      () => {
        this.blockEditorWhileSpeaking(false);
      }
    );
  }

  protected _updateReport(
    plainContent: string,
    richContent: string
  ): Promise<string> {
    return this._recognition.report.change(plainContent, richContent);
  }
}
