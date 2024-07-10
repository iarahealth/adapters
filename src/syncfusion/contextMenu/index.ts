import {
  CustomContentMenuEventArgs,
  DocumentEditor,
} from "@syncfusion/ej2-documenteditor";
import { MenuItemModel } from "@syncfusion/ej2-navigations";
import { IaraSyncfusionNavigationFieldManager } from "../navigationFields";
import { IaraSyncfusionLanguageManager } from "../language";

export class IaraSyncfusionContextMenuManager {
  constructor(
    private _editor: DocumentEditor,
    private _navigationFieldManager: IaraSyncfusionNavigationFieldManager,
    private _languageManager: IaraSyncfusionLanguageManager
  ) {
    const menuItems: MenuItemModel[] = [
      {
        separator: true,
      },
      {
        iconCss: "e-icons e-bookmark",
        text: this._languageManager.languages.language.iaraTranslate
          .customfields.content,
        id: "navigation-fields",
        items: [
          {
            iconCss: "e-icons e-plus",
            id: "add-navigation-field",
            text: this._languageManager.languages.language.iaraTranslate
              .customfields.add,
          },
          {
            iconCss: "e-icons e-lock",
            id: "add-mandatory-field",
            text: this._languageManager.languages.language.iaraTranslate
              .customfields.mandatory,
          },
          {
            iconCss: "e-icons e-circle-info",
            id: "add-optional-field",
            text: this._languageManager.languages.language.iaraTranslate
              .customfields.optional,
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
          this._navigationFieldManager.insertField(selectedText, undefined);
          break;
        case "add-mandatory-field":
          this._navigationFieldManager.insertField(
            selectedText,
            undefined,
            "Mandatory"
          );
          break;
        case "add-optional-field":
          this._navigationFieldManager.insertField(
            selectedText,
            undefined,
            "Optional"
          );
          break;
      }
    };
  }
}
