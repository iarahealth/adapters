import type { IaraSpeechRecognition } from "../speech";

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
  constructor(private _recognition: IaraSpeechRecognition) {
    this._recognition.addEventListener("iaraSpeechMikeForwardButtonPress", () =>
      this.nextField()
    );
    this._recognition.addEventListener("iaraSpeechMikeRewindButtonPress", () =>
      this.previousField()
    );
  }
}
