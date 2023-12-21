import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import { Editor as TinymceEditor } from "tinymce";
import { IaraSpeechRecognition, IaraSpeechRecognitionDetail } from "../speech";
import { IaraEditorInferenceFormatter } from "./formatter";
import { IaraEditorStyleManager } from "./style";

export abstract class EditorAdapter {
  public onFinishedReport?: () => void;
  protected _inferenceFormatter: IaraEditorInferenceFormatter;
  protected abstract _styleManager: IaraEditorStyleManager;
  private _listeners = [
    {
      key: "iaraSpeechRecognitionResult",
      callback: (event?: CustomEvent<IaraSpeechRecognitionDetail>) => {
        if (event?.detail) this.insertInference(event.detail);
      },
    },
    {
      key: "iaraSpeechRecognitionStart",
      callback: () => {
        this.blockEditorWhileSpeaking(true);
      },
    },
    {
      key: "iaraSpeechRecognitionStop",
      callback: () => {
        this.blockEditorWhileSpeaking(false);
      },
    },
    {
      key: "iaraSpeechRecognitionVADVoiceStart",
      callback: () => {
        this.blockEditorWhileSpeaking(true);
      },
    },
    {
      key: "iaraSpeechRecognitionVADVoiceStop",
      callback: () => {
        this.blockEditorWhileSpeaking(false);
      },
    },
  ];

  constructor(
    protected _editorContainer: DocumentEditorContainer | TinymceEditor,
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

  beginReport(): string | void {
    this._recognition.report["_key"] = "";
    return this._recognition.beginReport({ richText: "", text: "" });
  }

  finishReport(clear = true): void {
    console.log("AQUI");
    this.copyReport();
    if (clear) this.clearReport();
    this._recognition.finishReport();
    this.onFinishedReport?.();
  }

  private _initCommands(): void {
    this._recognition.commands.add("iara copiar laudo", () => {
      this._recognition.stop();
      this.copyReport();
    });
    this._recognition.commands.add("iara finalizar laudo", () => {
      this._recognition.stop();
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
    this._listeners.forEach(listener => {
      this._recognition.addEventListener(listener.key, listener.callback);
    });
  }

  protected async _onEditorDestroyed(): Promise<void> {
    this._listeners.forEach(listener => {
      this._recognition.removeEventListener(
        listener.key,
        listener.callback as EventListenerOrEventListenerObject
      );
    });
  }

  protected _updateReport(
    plainContent: string,
    richContent: string
  ): Promise<string> {
    return this._recognition.report.change(plainContent, richContent);
  }
}
