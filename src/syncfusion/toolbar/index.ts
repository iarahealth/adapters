import type { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import * as EJ2_LOCALE from "@syncfusion/ej2-locale/src/pt-BR.json";
import { toolBarSettings } from "./config";
import { IaraSyncfusionConfig } from "..";
import { MenuItemModel } from '@syncfusion/ej2-navigations';

export class IaraSyncfusionToolbarManager {
  constructor(
    private _editorContainer: DocumentEditorContainer,
    private _config: IaraSyncfusionConfig
  ) {
    let menuItems: MenuItemModel[] = [
      {
        text: "Navegação",
        id: "form-field-navigation",
        iconCss: 'e-icons e-text-form'
      }];
    this._editorContainer.documentEditor.contextMenu.addCustomMenu(menuItems, false, true);
    this._editorContainer.documentEditor.customContextMenuSelect = (args: any): void => {
      let item: string = args.id;
      let id: string = this._editorContainer.documentEditor.element.id;
      switch (item)
      {
        case id + 'form-field-navigation':
          this._editorContainer.documentEditor.editor.insertFormField('Text');
          break;
      }
    };
  }

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

    const editorContainerViewer = <HTMLElement>(
      document.querySelector(".e-de-tool-ctnr-properties-pane")
    );
    // The height of the container needs to be adjusted because the ribbon is smaller
    editorToolbarContainer.style.height = "auto";

    editorContainerViewer.style.height = "calc(100% - 84px)";

    const ribbonContainer = document.createElement("div");
    ribbonContainer.id = "ribbon";

    editorToolbarContainer.appendChild(ribbonContainer);

    toolbarRibbonItems.appendTo("#ribbon");
    const ribbonMenuElement = <HTMLElement>(
      document.querySelector(".e-ribbon-tab")
    );

    const menuRiboon = ribbonMenuElement.firstChild as HTMLElement;

    menuRiboon.style.display = "none";
  }
}
