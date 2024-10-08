import type { IaraSpeechRecognition } from "../speech";
import { IaraNavigationBookmark } from "../syncfusion/navigationFields/navigationBookmark";

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
  abstract bookmarks: IaraNavigationBookmark[];
  constructor(public recognition: IaraSpeechRecognition) {
    this.recognition.addEventListener("iaraSpeechMikeForwardButtonPress", () =>
      this.nextField()
    );
    this.recognition.addEventListener("iaraSpeechMikeRewindButtonPress", () =>
      this.previousField()
    );
  }
}
