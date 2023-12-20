import { IaraInference } from "../speech";

export abstract class EditorAdapter {
  constructor(protected _editor: any, protected _recognition: any) {
    _recognition.addEventListener(
      "iaraSpeechRecognitionResult",
      (event: { detail: IaraInference }) => {
        this.insertInference(event.detail);
      }
    );
  }

  abstract insertInference(inference: IaraInference): void;
}

export abstract class setEditorFont
{
    // constructor() {
    // }
}
