import type { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import * as EJ2_LOCALE_PT_BR from "@syncfusion/ej2-locale/src/pt-BR.json";
import * as EJ2_LOCALE_ES from "@syncfusion/ej2-locale/src/es.json";
import { toolBarSettings } from "./config";
import { IaraSyncfusionConfig } from "..";
import { createElement } from "@syncfusion/ej2-base";
import { TabItemModel, SelectingEventArgs } from "@syncfusion/ej2-navigations";

export class IaraSyncfusionToolbarManager {
  constructor(
    private _editorContainer: DocumentEditorContainer,
    private _config: IaraSyncfusionConfig
  ) {}

  public init(): void {
    this._addRibbonToolbar();
    this._removePropertiesPane();
    this._setupTrackChangesTab();
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
    let editorContainerLocale;
    switch (this._config.language) {
      case "es":
        editorContainerLocale = EJ2_LOCALE_ES["es"];
        break;
      default:
        editorContainerLocale = EJ2_LOCALE_PT_BR["pt-BR"];
        break;
    }
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
      editorContainerViewer.style.height = "calc(100% - 161px)";
      ribbonGroupContent.forEach(ribbon => {
        const ribbons = ribbon as HTMLElement;
        ribbons.style.height = "88px";
      });
      ribbonContentElement.style.height = "120px";
      ribbonExpandedMenuElement.style.height = "120px";
      this._editorContainer.resize();
    }
    if (layout === "Simplified") {
      editorContainerViewer.style.height = "calc(100% - 82px)";
      ribbonGroupContent.forEach(ribbon => {
        const ribbons = ribbon as HTMLElement;
        ribbons.style.height = "auto";
      });
      ribbonContentElement.style.height = "auto";
      ribbonExpandedMenuElement.style.height = "auto";
      this._editorContainer.resize();
    }
  }

  private _setupTrackChangesTab() {
    const acceptAllHeader: HTMLElement = createElement("div", {
      innerHTML: "Aceitar tudo",
    });
    const rejectAllHeader: HTMLElement = createElement("div", {
      innerHTML: "Rejeitar tudo",
    });

    const totalItems = document.querySelectorAll(
      "#iara-syncfusion-editor-container_editorReview_Tab_tab_header_items .e-toolbar-item"
    ).length;
    const items: TabItemModel[] = [
      { header: { text: acceptAllHeader } },
      { header: { text: rejectAllHeader } },
    ] as TabItemModel[];
    this._editorContainer.documentEditor.trackChangesPane[
      "commentReviewPane"
    ].reviewTab.addTab(items, totalItems);

    this._editorContainer.documentEditor.trackChangesPane[
      "commentReviewPane"
    ].reviewTab.addEventListener("selecting", (event: SelectingEventArgs) => {
      const selectedTabText = (
        event.selectingItem.getElementsByClassName("e-tab-text")[0]
          .childNodes[0] as HTMLElement
      ).innerText;
      if (selectedTabText == "ACEITAR TUDO") {
        event.cancel = true;
        this._editorContainer.documentEditor.revisions.acceptAll();
      } else if (selectedTabText == "REJEITAR TUDO") {
        event.cancel = true;
        this._editorContainer.documentEditor.revisions.rejectAll();
      }
    });
  }
}
