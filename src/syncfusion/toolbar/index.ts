import type { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import { toolBarSettings, toolbarButtonClick } from "./config";

export class IaraSyncfusionToolbarManager {
  constructor(private _editor: DocumentEditorContainer) {}

  public init() {
    const toolbarItems = toolBarSettings(this._editor);
    this._editor.toolbarModule.toolbar.addItems(toolbarItems, 5);
    this._editor.toolbarClick = this._onClickToolbar.bind(this);
    this._removePropertiesPane();
  }

  private _onClickToolbar(arg: { item: { id: string } }): void {
    toolbarButtonClick(arg, this._editor);
  }

  private _removePropertiesPane(): void {
    this._editor.showPropertiesPane = false;
    const paneButton: HTMLElement | null = document.querySelector(
      ".e-de-ctnr-properties-pane-btn"
    );
    paneButton?.remove();
    //remove wrapper button
    const wrapper: HTMLElement | null =
      document.querySelector(".e-de-tlbr-wrapper");
    if (wrapper) wrapper.style.width = "100%";
  }
}
