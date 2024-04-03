import {
  CustomContentMenuEventArgs,
  DocumentEditor,
} from "@syncfusion/ej2-documenteditor";
import { MenuItemModel } from "@syncfusion/ej2-navigations";
import { IaraSyncfusionNavigationFieldManager } from "../navigationFields";

export class IaraSyncfusionContextMenuManager {
  constructor(
    private _editor: DocumentEditor,
    private _navigationFieldManager: IaraSyncfusionNavigationFieldManager
  ) {
    const menuItems: MenuItemModel[] = [
      {
        separator: true,
      },
      {
        iconCss: "e-icons e-bookmark",
        text: "Campos de navegação",
        id: "navigation-fields",
        items: [
          {
            iconCss: "e-icons e-plus",
            id: "add-navigation-field",
            text: "Adicionar campo",
          },
          {
            iconCss: "e-icons e-lock",
            id: "add-mandatory-field",
            text: "Adicionar campo obrigatório",
          },
          {
            iconCss: "e-icons e-circle-info",
            id: "add-optional-field",
            text: "Adicionar campo opicional",
          },
        ],
      },
    ];

    this._editor.contextMenu.addCustomMenu(menuItems, false, true);

    this._editor.customContextMenuSelect = (
      args: CustomContentMenuEventArgs
    ): void => {
      const item: string = args.id;

      const selectedText = this._editor.selection.text
        ? this._editor.selection.text.trim()
        : undefined;

      switch (item) {
        case "add-navigation-field":
          this._navigationFieldManager.insertField(selectedText);
          break;
        case "add-mandatory-field":
          this._navigationFieldManager.insertMandatoryField(selectedText);
          break;
        case "add-optional-field":
          this._navigationFieldManager.insertOptionalField(selectedText);
          break;
      }
    };
  }
}
