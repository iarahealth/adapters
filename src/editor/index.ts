import {
  Config,
  IaraSpeechRecognition,
  IaraSpeechRecognitionDetail,
} from "../speech";
import { Ribbon } from "../syncfusion/toolbar/ribbon";
import { IaraEditorInferenceFormatter } from "./formatter";
import Locales from "./locales";
import { IaraEditorNavigationFieldManager } from "./navigationFields";
import { IaraEditorStyleManager } from "./style";

export interface IaraEditorConfig {
  darkMode: boolean;
  enableSpeechRecognition: boolean;
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
  mouseButton: boolean;
}

export abstract class EditorAdapter {
  public onIaraCommand?: (command: string) => void;
  protected _locale: Record<string, string> = {};
  protected abstract _styleManager: IaraEditorStyleManager;
  protected abstract _navigationFieldManager: IaraEditorNavigationFieldManager;
  protected static DefaultConfig: IaraEditorConfig = {
    darkMode: false,
    enableSpeechRecognition: true,
    saveReport: true,
    zoomFactor: "100%",
    language: "pt-BR",
    highlightInference: true,
    mouseButton: false,
  };
  protected _inferenceFormatter: IaraEditorInferenceFormatter;
  protected _currentLanguage: { [k: string]: any } = {};
  protected _defaultCommandArgs: [undefined, undefined, Config | Config[]] = [
    undefined,
    undefined,
    { searchRichTranscript: true } as Config,
  ];

  private readonly _speechListeners = [
    {
      key: "iaraSpeechRecognitionResult",
      callback: (event?: CustomEvent<IaraSpeechRecognitionDetail>) => {
        if (!event?.detail || !this.config.enableSpeechRecognition) return;
        this.insertInference(event.detail);
      },
    },
    {
      key: "iaraSpeechRecognitionStart",
      callback: () => {
        if (!this.config.enableSpeechRecognition) return;
        this.blockEditorWhileSpeaking(true);
      },
    },

    {
      key: "iaraSpeechRecognitionStop",
      callback: () => {
        if (!this.config.enableSpeechRecognition) return;
        this.blockEditorWhileSpeaking(false);
      },
    },
    {
      key: "iaraSpeechRecognitionVADVoiceStart",
      callback: () => {
        if (!this.config.enableSpeechRecognition) return;
        this.blockEditorWhileSpeaking(true);
      },
    },
    {
      key: "iaraSpeechRecognitionVADVoiceStop",
      callback: () => {
        if (!this.config.enableSpeechRecognition) return;
        this.blockEditorWhileSpeaking(false);
      },
    },
  ];

  constructor(
    protected _recognition: IaraSpeechRecognition,
    public config: IaraEditorConfig = EditorAdapter.DefaultConfig
  ) {
    switch (this.config.language) {
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

  protected abstract _handleRemovedNavigationField(): void;
  abstract blockEditorWhileSpeaking(status: boolean): void;
  abstract clearReport(): void;
  abstract copyReport(): Promise<string[]>;
  abstract insertInference(inference: IaraSpeechRecognitionDetail): void;
  abstract getEditorContent(): Promise<[string, string, string, string?]>;
  abstract print(): void;

  async beginReport(): Promise<string | void> {
    if (!this.config.saveReport) return;
    return this._recognition.report.begin("", "");
  }

  async finishReport(metadata?: Record<string, unknown>): Promise<string[]> {
    if (!this.config.saveReport) return [];
    const content = await this.copyReport();
    this.clearReport();
    await this._recognition.report.finish(content[0], content[1], metadata);
    return content;
  }

  hasEmptyRequiredFields(): boolean {
    return this._navigationFieldManager.hasEmptyRequiredFields();
  }

  navigationManagerFields(): IaraEditorNavigationFieldManager {
    return this._navigationFieldManager;
  }

  protected _initCommands(): void {
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
      },
      ...this._defaultCommandArgs
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
      },
      ...this._defaultCommandArgs
    );
    this._recognition.commands.add(
      this._locale.toggleBold,
      () => {
        this._onIaraCommand(this._locale.toggleBold);
        this._styleManager.toggleBold();
      },
      ...this._defaultCommandArgs
    );
    this._recognition.commands.add(
      this._locale.toggleItalic,
      () => {
        this._onIaraCommand(this._locale.toggleItalic);
        this._styleManager.toggleItalic();
      },
      ...this._defaultCommandArgs
    );
    this._recognition.commands.add(
      this._locale.toggleList,
      () => {
        this._onIaraCommand(this._locale.toggleList);
        this._styleManager.toggleList();
      },
      ...this._defaultCommandArgs
    );
    this._recognition.commands.add(
      this._locale.toggleNumberedList,
      () => {
        this._onIaraCommand(this._locale.toggleNumberedList);
        this._styleManager.toggleNumberedList();
      },
      ...this._defaultCommandArgs
    );
    this._recognition.commands.add(
      this._locale.toggleUnderline,
      () => {
        this._onIaraCommand(this._locale.toggleUnderline);
        this._styleManager.toggleUnderline();
      },
      ...this._defaultCommandArgs
    );
    this._recognition.commands.add(
      this._locale.toggleUppercase,
      () => {
        this._onIaraCommand(this._locale.toggleUppercase);
        this._styleManager.toggleUppercase();
      },
      ...this._defaultCommandArgs
    );
    this._recognition.commands.add(
      this._locale.print,
      () => {
        this._onIaraCommand(this._locale.print);
        this.print();
      },
      ...this._defaultCommandArgs
    );
    this._recognition.commands.add(
      this._locale.nextField,
      (detail, command) => {
        if (detail.transcript === command) this._handleRemovedNavigationField();
        this._navigationFieldManager.nextField();
      },
      ...this._defaultCommandArgs
    );
    this._recognition.commands.add(
      this._locale.previousField,
      (detail, command) => {
        if (detail.transcript === command) this._handleRemovedNavigationField();
        this._navigationFieldManager.previousField();
      },
      ...this._defaultCommandArgs
    );
    this._recognition.commands.add(
      this._locale.next,
      (detail, command) => {
        if (detail.transcript === command) this._handleRemovedNavigationField();
        this._navigationFieldManager.nextField();
      },
      ...this._defaultCommandArgs
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
      },
      ...this._defaultCommandArgs
    );
  }

  private _initListeners(): void {
    this._speechListeners.forEach(listener => {
      this._recognition.addEventListener(listener.key, listener.callback);
    });
  }

  protected async _onEditorDestroyed(): Promise<void> {
    this._recognition.report["_key"] = "";
    this._speechListeners.forEach(listener => {
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
    if (this.config.saveReport && !this._recognition.report["_key"]) {
      if (this._recognition.ready) {
        this._recognition.report["_key"] = await this.beginReport();
      } else {
        const readyCallback = async () => {
          this._recognition.report["_key"] = await this.beginReport();
          this._recognition.removeEventListener(
            "iaraSpeechRecognitionReady",
            readyCallback
          );
        };
        this._recognition.addEventListener(
          "iaraSpeechRecognitionReady",
          readyCallback
        );
      }
    }
  }
}
