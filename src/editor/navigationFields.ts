import type { IaraSpeechRecognition } from "../speech";
import { IaraAdditiveBookmark } from "../syncfusion/navigationFields/navigationBookmark";

export abstract class IaraEditorNavigationFieldManager {
  abstract nextField(): void;
  abstract previousField(): void;
  abstract goToField(title: string): void;
  abstract hasEmptyRequiredFields(): boolean;
  abstract insertField(
    content?: string,
    title?: string,
    type?: "Field" | "Mandatory" | "Optional"
  ): void;
  abstract additiveBookmark: IaraAdditiveBookmark;

  private readonly _recognitionListeners: {
    key: string;
    callback: () => void;
  }[] = [
    {
      key: "iaraSpeechMikeForwardButtonPress",
      callback: this.nextField.bind(this),
    },
    {
      key: "iaraSpeechMikeRewindButtonPress",
      callback: this.previousField.bind(this),
    },
  ];

  constructor(private readonly _recognition: IaraSpeechRecognition) {
    this._initListeners();
  }

  private _initListeners(): void {
    this._recognitionListeners.forEach(listener => {
      this._recognition.addEventListener(listener.key, listener.callback);
    });
  }

  destroy(): void {
    this._recognitionListeners.forEach(listener => {
      this._recognition.removeEventListener(
        listener.key,
        listener.callback as EventListenerOrEventListenerObject
      );
    });
  }
}
