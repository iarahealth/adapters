import type { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import * as EJ2_LOCALE from "@syncfusion/ej2-locale/src/pt-BR.json";
import { toolBarSettings } from "./config";
import { IaraSyncfusionConfig } from "..";

export class IaraSyncfusionToolbarManager {
  constructor(
    private _editorContainer: DocumentEditorContainer,
    private _config: IaraSyncfusionConfig
  ) {}

  public init(): void {
    this._addRibbonToolbar();
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

  private _addRibbonToolbar(): void {
    const editorContainerLocale = EJ2_LOCALE["pt-BR"];

    const toolbarRibbonItems = toolBarSettings(
      this._editorContainer,
      editorContainerLocale,
      this._config
    );
    const editorToolbarContainer = <HTMLElement>(
      document.querySelector(".e-de-ctnr-toolbar")
    );

    // The height of the container needs to be adjusted because the ribbon is smaller
    editorToolbarContainer.style.height = "auto";

    const ribbonContainer = document.createElement("div");
    ribbonContainer.id = "ribbon";

    editorToolbarContainer.appendChild(ribbonContainer);

    toolbarRibbonItems.appendTo("#ribbon");
    const ribbonMenuElement = <HTMLElement>(
      document.querySelector(".e-ribbon-tab")
    );

    const menuRiboon = ribbonMenuElement.firstChild as HTMLElement;

    menuRiboon.style.display = "none";

    const ribbonCollapseBtn = <HTMLElement>(
      document.querySelector("#ribbon_tab_collapsebutton")
    );

    this.ribbonItensLayout("Classic");

    ribbonCollapseBtn.addEventListener("click", () => {
      this.ribbonItensLayout(toolbarRibbonItems.activeLayout);
    });
  }

  ribbonItensLayout(layout: string): void {
    const editorContainerViewer = <HTMLElement>(
      document.querySelector(".e-de-tool-ctnr-properties-pane")
    );
    const ribbonContentElement = <HTMLElement>(
      document.querySelector(".e-content.e-lib.e-touch")
    );

    const ribbonExpandedMenuElement = <HTMLElement>(
      document.querySelector(".e-ribbon.e-rbn")
    );

    const ribbonGroupContent = document.querySelectorAll(
      ".e-ribbon-group-content"
    );
    if (layout === "Classic") {
      editorContainerViewer.style.height = "calc(100% - 156px)";
      ribbonGroupContent.forEach(ribbon => {
        const ribbons = ribbon as HTMLElement;
        ribbons.style.height = "88px";
      });
      ribbonContentElement.style.height = "120px";
      ribbonExpandedMenuElement.style.height = "120px";
    }
    if (layout === "Simplified") {
      editorContainerViewer.style.height = "calc(100% - 77px)";
      ribbonGroupContent.forEach(ribbon => {
        const ribbons = ribbon as HTMLElement;
        ribbons.style.height = "auto";
      });
      ribbonContentElement.style.height = "auto";
      ribbonExpandedMenuElement.style.height = "auto";
    }
  }
}
