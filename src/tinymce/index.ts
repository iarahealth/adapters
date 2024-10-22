import { Editor } from "tinymce";
import { EditorAdapter, IaraEditorConfig } from "../editor";
import { IaraEditorInferenceFormatter } from "../editor/formatter";
import type {
  IaraSpeechRecognition,
  IaraSpeechRecognitionDetail,
} from "../speech";
import { IaraTinyMceStyleManager } from "./style";
import { IaraTinyMceNavigationFieldManager } from "./navigationFields";

export class IaraTinyMCEAdapter extends EditorAdapter implements EditorAdapter {
  protected _styleManager: IaraTinyMceStyleManager;
  protected _navigationFieldManager: IaraTinyMceNavigationFieldManager;
  private _initialUndoStackSize = 0;

  constructor(
    protected _editor: Editor,
    protected _recognition: IaraSpeechRecognition,
    public config: IaraEditorConfig
  ) {
    super(_recognition, config);
    this._inferenceFormatter = new IaraEditorInferenceFormatter();
    this._styleManager = new IaraTinyMceStyleManager();
    this._navigationFieldManager = new IaraTinyMceNavigationFieldManager(
      _recognition
    );
    this._editor.on("destroyed", this._onEditorDestroyed.bind(this));
  }

  protected _handleRemovedNavigationField(): void {
    throw new Error("Method not implemented.");
  }

  getUndoStackSize(): number {
    return (this._editor.undoManager as any).data.length || 0;
  }

  getEditorContent(): Promise<[string, string, string]> {
    throw new Error("Método não implementado.");
  }

  insertInference(inference: IaraSpeechRecognitionDetail): void {
    if (inference.isFirst) {
      this._initialUndoStackSize = this.getUndoStackSize();
    } else {
      const undoStackSize = this.getUndoStackSize();
      for (let i = 0; i < undoStackSize - this._initialUndoStackSize; i++)
        this.undo();
    }

    const text = inference.richTranscript
      .replace(/^<div>/, "")
      .replace(/<\/div>$/, "");
    const [firstLine, ...lines]: string[] = text.split("</div><div>");

    this.insertText(`${firstLine}\n`);

    lines.forEach(line => {
      this.insertParagraph();
      line = line.trim();
      if (line) this.insertText(line);
    });
  }

  insertParagraph() {
    this._editor.execCommand("InsertParagraph");
  }

  insertText(text: string) {
    this._editor.insertContent(text);
  }

  blockEditorWhileSpeaking(status: boolean) {
    const wrapper = document.getElementsByTagName("tinymce")[0] as HTMLElement;
    if (wrapper) wrapper.style.cursor = status ? "not-allowed" : "auto";
  }

  undo() {
    this._editor.undoManager.undo();
  }

  copyReport(): Promise<string[]> {
    throw new Error("Método não implementado.");
  }

  clearReport(): void {
    throw new Error("Método não implementado.");
  }

  print(): void {
    throw new Error("Method not implemented.");
  }

  nextField(): void {
    throw new Error("Method not implemented.");
  }
  previousField(): void {
    throw new Error("Method not implemented.");
  }
  goToField(title: string): void {
    console.log(title);
    throw new Error("Method not implemented.");
  }
  hasEmptyRequiredFields(): boolean {
    throw new Error("Method not implemented.");
  }
  insertField() {
    throw new Error("Method not implemented.");
  }
  aditiveBookmark = {};
}
