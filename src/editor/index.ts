import { IaraSpeechRecognition, IaraSpeechRecognitionDetail } from "../speech";
import { IaraEditorInferenceFormatter } from "./formatter";
import { IaraEditorStyleManager } from "./style";

import { IaraEditorNavigationFieldManager } from "./navigationFields";

export interface IaraEditorConfig {
  darkMode: boolean;
  font?: {
    availableFamilies: string[];
    availableSizes: number[];
    family: string;
    size: number;
  };
  saveReport: boolean;
  zoomFactor: string;
  editRibbon: boolean;
}

export abstract class EditorAdapter {
  public onIaraCommand?: (command: string) => void;
  public iaraRecognizes = true;
  protected abstract _styleManager: IaraEditorStyleManager;
  protected abstract _navigationFieldManager: IaraEditorNavigationFieldManager;
  protected static DefaultConfig: IaraEditorConfig = {
    darkMode: false,
    saveReport: true,
    zoomFactor: "100%",
    editRibbon: false,
  };
  protected _inferenceFormatter: IaraEditorInferenceFormatter;

  private _listeners = [
    {
      key: "iaraSpeechRecognitionResult",
      callback: (event?: CustomEvent<IaraSpeechRecognitionDetail>) => {
        if (event?.detail && this.iaraRecognizes)
          this.insertInference(event.detail);
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
    protected _recognition: IaraSpeechRecognition,
    protected _config: IaraEditorConfig = EditorAdapter.DefaultConfig
  ) {
    this._inferenceFormatter = new IaraEditorInferenceFormatter();
    this._initCommands();
    this._initListeners();
    this._recognition.internal.settings.replaceCommandActivationStringBeforeCallback =
      true;
    if (this._config.saveReport && !this._recognition.report["_key"]) {
      if (this._recognition.ready) this.beginReport().catch(console.error);
      else {
        this._recognition.addEventListener("iaraSpeechRecognitionReady", () => {
          this.beginReport().catch(console.error);
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
    return this._recognition.report.begin("", "");
  }

  async finishReport(): Promise<void> {
    if (!this._config.saveReport) return;
    const content = await this.copyReport();
    this.clearReport();
    await this._recognition.report.finish(content[0], content[1]);
  }

  hasEmptyRequiredFields(): boolean {
    return this._navigationFieldManager.hasEmptyRequiredFields();
  }

  private _initCommands(): void {
    this._recognition.commands.add("iara copiar laudo", async () => {
      if (this.hasEmptyRequiredFields()) {
        this.onIaraCommand?.("required fields to copy");
        return;
      }
      this._recognition.stop();
      await this.copyReport();
      this.onIaraCommand?.("iara copiar laudo");
    });
    this._recognition.commands.add("iara finalizar laudo", async () => {
      if (this.hasEmptyRequiredFields()) {
        this.onIaraCommand?.("required fields to finish");
        return;
      }
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
    this._recognition.commands.add("iara próximo campo", () => {
      this._navigationFieldManager.nextField();
    });
    this._recognition.commands.add("iara campo anterior", () => {
      this._navigationFieldManager.previousField();
    });
    this._recognition.commands.add("next", () => {
      this._navigationFieldManager.nextField();
    });
    this._recognition.commands.add(
      `buscar (\\p{Letter}+)`,
      (detail, command, param, groups) => {
        try {
          this._navigationFieldManager.goToField(groups ? groups[1] : "");
        } catch (e) {
          this.onIaraCommand?.("buscar");
        } finally {
          console.info(detail, command, param);
        }
      }
    );
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
