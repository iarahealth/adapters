import { IaraSpeechRecognition, IaraSpeechRecognitionDetail } from "../speech";
import { Ribbon } from "../syncfusion/toolbar/ribbon";
import { IaraEditorInferenceFormatter } from "./formatter";
import Locales from "./locales";
import { IaraEditorNavigationFieldManager } from "./navigationFields";
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
  language: "pt-BR" | "es";
  zoomFactor: string;
  highlightInference: boolean;
  ribbon?: Ribbon;
}

export abstract class EditorAdapter {
  public onIaraCommand?: (command: string) => void;
  public preprocessAndInsertTemplate?: (
    template: unknown,
    metadata: unknown
  ) => Promise<void>;
  public iaraRecognizes = true;
  public selectedField: {
    content: string;
    title: string;
    type: "Field" | "Mandatory" | "Optional";
  } = { content: "", title: "", type: "Field" };
  protected _locale: Record<string, string> = {};
  protected abstract _styleManager: IaraEditorStyleManager;
  protected abstract _navigationFieldManager: IaraEditorNavigationFieldManager;
  protected static DefaultConfig: IaraEditorConfig = {
    darkMode: false,
    saveReport: true,
    zoomFactor: "100%",
    language: "pt-BR",
    highlightInference: true,
  };
  protected _inferenceFormatter: IaraEditorInferenceFormatter;
  protected _currentLanguage: {[k: string]: any} = {};

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
    switch (this._config.language) {
      case "es":
        this._locale = Locales["es"];
        break;
      default:
        this._locale = Locales["pt-BR"];
        break;
    }
    this._inferenceFormatter = new IaraEditorInferenceFormatter();
    this._initCommands();
    this._initListeners();
    this._recognition.internal.settings.replaceCommandActivationStringBeforeCallback =
      true;
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

  navigationManagerFields(): IaraEditorNavigationFieldManager {
    return this._navigationFieldManager;
  }

  private _handleRemovedNavigationField(): void {
    const { content, title, type } = this.selectedField;
    if (this.selectedField.content)
      this._navigationFieldManager.insertField(content, title, type);
  }

  private _initCommands(): void {
    this._recognition.commands.add(
      this._locale.copyReport,
      async (detail, command) => {
        if (detail.transcript === command) this._handleRemovedNavigationField();
        if (this.hasEmptyRequiredFields()) {
          this._onIaraCommand?.("required fields to copy");
          return;
        }
        this.onIaraCommand?.(this._locale.copyReport);
        this._recognition.stop();
        await this.copyReport();
      }
    );
    this._recognition.commands.add(
      this._locale.finishReport,
      async (detail, command) => {
        if (detail.transcript === command) this._handleRemovedNavigationField();
        if (this.hasEmptyRequiredFields()) {
          this._onIaraCommand?.("required fields to finish");
          return;
        }
        this._onIaraCommand?.(this._locale.finishReport);
        this._recognition.stop();
        await this.finishReport();
      }
    );
    this._recognition.commands.add(this._locale.toggleBold, () => {
      this._onIaraCommand(this._locale.toggleBold);
      this._styleManager.toggleBold();
    });
    this._recognition.commands.add(this._locale.toggleItalic, () => {
      this._onIaraCommand(this._locale.toggleItalic);
      this._styleManager.toggleItalic();
    });
    this._recognition.commands.add(this._locale.toggleUnderline, () => {
      this._onIaraCommand(this._locale.toggleUnderline);
      this._styleManager.toggleUnderline();
    });
    this._recognition.commands.add(this._locale.toggleUppercase, () => {
      this._onIaraCommand(this._locale.toggleUppercase);
      this._styleManager.toggleUppercase();
    });
    this._recognition.commands.add(this._locale.print, () => {
      this._onIaraCommand(this._locale.print);
      this.print();
    });
    this._recognition.commands.add(this._locale.nextField, (detail, command) => {
      if (detail.transcript === command) this._handleRemovedNavigationField();
      this._navigationFieldManager.nextField();
      this._onIaraCommand(this._locale.nextField);
    });
    this._recognition.commands.add(this._locale.previousField, (detail, command) => {
      if (detail.transcript === command) this._handleRemovedNavigationField();
      this._onIaraCommand(this._locale.previousField);
      this._navigationFieldManager.previousField();
    });
    this._recognition.commands.add(
      this._locale.next,
      (detail, command) => {
        if (detail.transcript === command) this._handleRemovedNavigationField();
        this._onIaraCommand(this._locale.next);
        this._navigationFieldManager.nextField();
      }
    );
    this._recognition.commands.add(
      `${this._locale.search} (\\p{Letter}+)`,
      (detail, command, param, groups) => {
        if (detail.transcript === (groups?.length && groups[0])) {
          this._handleRemovedNavigationField();
        }
        try {
          this._navigationFieldManager.goToField(groups ? groups[1] : "");
        } catch (e) {
          this.onIaraCommand?.(this._locale.search);
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

  protected _onIaraCommand(command: string): void {
    this.onIaraCommand?.(command);
  }

  protected _updateReport(
    plainContent: string,
    richContent: string
  ): Promise<string> {
    if (this._recognition.report["_key"]) {
      return this._recognition.report.change(plainContent, richContent);
    }
    throw new Error("Need a report key to update.");
  }

  protected async _beginReport(): Promise<void> {
    if (this._config.saveReport && !this._recognition.report["_key"]) {
      if (this._recognition.ready) {
        this._recognition.report["_key"] = await this.beginReport();
      } else {
        this._recognition.addEventListener(
          "iaraSpeechRecognitionReady",
          async () => {
            this._recognition.report["_key"] = await this.beginReport();
          }
        );
      }
    }
  }
}
