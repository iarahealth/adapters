import {
  type Editor,
  type EditorHistory,
} from "@syncfusion/ej2-documenteditor";

import { EditorAdapter } from "../editor";
import { IaraInference } from "../speech";
import { toolBarSettings, toolbarButtonClick } from "./toolbarConfig";

export class IaraSyncfusionAdapter
  extends EditorAdapter
  implements EditorAdapter
{
  private _initialUndoStackSize = 0;

  private _toolBar = this._editor.toolbarModule.toolbar;

  private get _editorAPI(): Editor {
    return this._editor.documentEditor.editor;
  }

  private get _editorHistory(): EditorHistory {
    return this._editor.documentEditor.editorHistory;
  }

  constructor(_editor: any, _recognition: any) {
    super(_editor, _recognition);
    this.initToolbarConfigs();
  }

  getUndoStackSize(): number {
    return this._editorHistory.undoStack?.length || 0;
  }

  insertParagraph() {
    this._editorAPI.insertText("\n");
  }

  insertText(text: string) {
    this._editorAPI.insertText(text);
  }

  insertInference(inference: IaraInference) {
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

    this.insertText(firstLine);

    lines.forEach(line => {
      this.insertParagraph();
      line = line.trim();
      if (line) this.insertText(line);
    });
  }

  initToolbarConfigs() {
    const toolbarItems = toolBarSettings(this._editor);
    this._toolBar.addItems(toolbarItems, 5);
    this._editor.toolbarClick = this.onClickToolbar.bind(this);
    this.removePropertiesPane();
  }

  onClickToolbar(arg: { item: any }) {
    toolbarButtonClick(arg, this._editorAPI, this._editor);
  }

  removePropertiesPane() {
    this._editor.showPropertiesPane = false;
    const paneButton = document.querySelector(
      ".e-de-ctnr-properties-pane-btn"
    ) as HTMLElement;
    paneButton.remove();
    //remove wrapper button
    const wrapper = document.querySelector(".e-de-tlbr-wrapper") as HTMLElement;
    wrapper.style.width = "100%";
  }

  undo() {
    this._editorHistory.undo();
  }
}
