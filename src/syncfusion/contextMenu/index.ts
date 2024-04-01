import {
  ContextMenu,
  MenuItemModel,
  ContextMenuModel,
} from "@syncfusion/ej2-navigations";
import { enableRipple } from "@syncfusion/ej2-base";
import { DocumentEditor } from "@syncfusion/ej2-documenteditor";

export class IaraSyncfusionContextMenuManager {
  constructor(private _editor: DocumentEditor) {
    enableRipple(true);

    const menuItems: MenuItemModel[] = [
      {
        separator: true,
      },
      {
        text: "View",
        items: [
          {
            text: "Large icons",
          },
          {
            text: "Medium icons",
          },
          {
            text: "Small icons",
          },
        ],
      },
    ];

    console.log(this._editor.contextMenuModule, "ITENS");
    this._editor.contextMenuModule.addMenuItems(menuItems);
    console.log(this._editor.contextMenu, "ITENS2");

    // const menuObj: ContextMenu = new ContextMenu(menuOptions, "#contextmenu");

    // const menuObj: ContextMenu = document.getElementById(
    //   ""
    // );

    // menuOptions.insertAfter([{ text: "View" }], "Parágrafo...");
  }
}
