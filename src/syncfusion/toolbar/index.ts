import type { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import * as EJ2_LOCALE from "@syncfusion/ej2-locale/src/pt-BR.json";
import { toolBarSettings } from "./config";

export class IaraSyncfusionToolbarManager {
  constructor(private _editorContainer: DocumentEditorContainer) {}

  public init(): void {
    const editorContainerLocale = EJ2_LOCALE["pt-BR"];
    const toolbarRibbonItems = toolBarSettings(
      this._editorContainer,
      editorContainerLocale
    );
    const editorToolbarContainer = <HTMLElement>(
      document.querySelector(".e-de-ctnr-toolbar")
    );
    editorToolbarContainer.style.alignItems = "center";

    const ribbonContainer = document.createElement("div");
    ribbonContainer.id = "ribbon";

    editorToolbarContainer.appendChild(ribbonContainer);

    toolbarRibbonItems.appendTo("#ribbon");
    const ribbonMenuElement = <HTMLElement>(
      document.querySelector(".e-ribbon-tab")
    );

    const menuRiboon = ribbonMenuElement.firstChild as HTMLElement;

    menuRiboon.style.display = "none";

    this._removePropertiesPane();
  }

  private _removePropertiesPane(): void {
    this._editorContainer.showPropertiesPane = false;
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
