import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import { Editor as TinymceEditor } from "tinymce";
import { IaraSpeechRecognition, IaraSpeechRecognitionDetail } from "../speech";
import { IaraEditorInferenceFormatter } from "./formatter";
import { IaraEditorStyleManager } from "./style";

export interface IaraEditorConfig {
  darkMode: boolean;
  font?: {
    availableFamilies: string[];
    availableSizes: number[];
    family: string;
    size: number;
  };
  saveReport: boolean;
}

export abstract class EditorAdapter {
  public onIaraCommand?: (command: string) => void;

  protected abstract _styleManager: IaraEditorStyleManager;
  protected static DefaultConfig: IaraEditorConfig = {
    darkMode: false,
    saveReport: true,
  };

  protected _inferenceFormatter: IaraEditorInferenceFormatter;

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
    protected _recognition: IaraSpeechRecognition,
    protected _config: IaraEditorConfig = EditorAdapter.DefaultConfig
  ) {
    this._inferenceFormatter = new IaraEditorInferenceFormatter();
    this._initCommands();
    this._initListeners();
    this._recognition.internal.settings.replaceCommandActivationStringBeforeCallback =
      true;
    if (this._config.saveReport && !this._recognition.report["_key"]) {
      if (this._recognition.ready) this.beginReport();
      else {
        this._recognition.addEventListener("iaraSpeechRecognitionReady", () => {
          this.beginReport();
        });
      }
    }
  }

  abstract blockEditorWhileSpeaking(status: boolean): void;
  abstract clearReport(): void;
  abstract copyReport(): Promise<string[]>;
  abstract insertInference(inference: IaraSpeechRecognitionDetail): void;
  abstract getEditorContent(): Promise<[string, string, string, string?]>;
  abstract print(): void;

  async beginReport(): Promise<string | void> {
    if (!this._config.saveReport) return;
    return new Promise(resolve => {
      this._recognition.beginReport({ richText: "", text: "" }, resolve);
    });
  }

  async finishReport(): Promise<void> {
    if (!this._config.saveReport) return;
    const content = await this.copyReport();
    this.clearReport();
    this._recognition.finishReport({ richText: content[1], text: content[0] });
  }

  private _initCommands(): void {
    this._recognition.commands.add("iara copiar laudo", async () => {
      this._recognition.stop();
      await this.copyReport();
      this.onIaraCommand?.("iara copiar laudo");
    });
    this._recognition.commands.add("iara finalizar laudo", async () => {
      this._recognition.stop();
      await this.finishReport();
      this.onIaraCommand?.("iara finalizar laudo");
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
    this._recognition.commands.add("iara imprimir", () => {
      this.print();
    });
  }

  private _initListeners(): void {
    this._listeners.forEach(listener => {
      this._recognition.addEventListener(listener.key, listener.callback);
    });
  }

  protected async _onEditorDestroyed(): Promise<void> {
    this._recognition.report["_key"] = "";
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
