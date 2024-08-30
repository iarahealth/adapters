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
  constructor(private _recognition: IaraSpeechRecognition) {
    this._recognition.addEventListener("iaraSpeechMikeForwardButtonPress", () =>
      this.nextField()
    );
    this._recognition.addEventListener("iaraSpeechMikeRewindButtonPress", () =>
      this.previousField()
    );
  }
}
