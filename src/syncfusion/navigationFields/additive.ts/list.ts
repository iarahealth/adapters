import { ListView } from "@syncfusion/ej2-lists";
import { IaraSyncfusionNavigationFieldManager } from "..";
import { IaraAdditiveBookmark } from "../navigationBookmark";

export class IaraSyncfusionAdditiveList {
  constructor(
    private _instance: IaraSyncfusionNavigationFieldManager,
    private _additiveField: IaraAdditiveBookmark,
    private _additiveId: string
  ) {
    this.create();
  }

  create = () => {
    const contextMenuElement = document.createElement("ul");
    contextMenuElement.id = "contextmenu-iara";
    console.log(
      this._instance._documentEditor.documentHelper.viewerContainer,
      "VIERWR"
    );
    this._instance._documentEditor.documentHelper.viewerContainer.appendChild(
      contextMenuElement
    );
    const menuItems = this._additiveField.additiveTexts.map(text => {
      return {
        text: text.identifier,
        value: text.phrase,
      };
    });
    let fieldSelected: string[] = [];
    const listObj: ListView = new ListView({
      dataSource: menuItems,
      showCheckBox: true,
      width: "200px",
      select: (args: {
        data: { text: string; value: string };
        isChecked: boolean;
      }) => {
        if (args.isChecked) {
          this._instance.selectBookmark(this._additiveId);
          if (!fieldSelected.includes(`${this._additiveId}-${args.data.text}`))
            fieldSelected = [...fieldSelected, args.data.value];
        } else {
          fieldSelected = fieldSelected.filter(additive => {
            return (
              `${this._additiveId}-${additive}` !==
              `${this._additiveId}-${args.data.text}`
            );
          });
        }
      },
    });
    listObj.appendTo("#contextmenu-iara");
    this.customPosition(listObj);
    this.customStyle(listObj);
    const btn = this.customButton(contextMenuElement);
    btn.onclick = () => this.addContent(fieldSelected);
  };

  addContent = (fieldSelected: string[]) => {
    this.closeList();
    fieldSelected.map((fileChecked, index) => {
      this._instance._documentEditor.editor.insertText(fileChecked);
      if (fieldSelected.length - 2 === index) {
        this._instance._documentEditor.editor.insertText(
          ` ${this._additiveField.delimiterEnd} `
        );
      } else if (fieldSelected.length - 1 !== index) {
        this._instance._documentEditor.editor.insertText(
          `${this._additiveField.delimiterStart} `
        );
      }
    });
  };

  customStyle = (listObj: ListView) => {
    listObj.element.style.margin = "0";
    listObj.element.style.padding = "0";
    listObj.element.style.zIndex = "999";
    listObj.element.style.borderColor = "#BAE1FE";
    listObj.element.style.borderRadius = "5px";
    listObj.element.style.borderStyle = "dotted";
    listObj.element.style.borderWidth = "1px";
  };

  customPosition = (listObj: ListView) => {
    const documentEditorContainer =
      this._instance._documentEditor.element.getBoundingClientRect();
    const textPosition =
      this._instance._documentEditor.selection.start.location;
    const rulerOffset =
      this._instance._documentEditor.hRuler.element.getBoundingClientRect();
    const yPos = rulerOffset.top + textPosition.y;
    const xPos =
      rulerOffset.left + textPosition.x - documentEditorContainer.left;
    listObj.element.style.position = "relative";
    listObj.element.style.top = `${yPos}px`;
    listObj.element.style.left = `${xPos}px`;
  };

  customButton = (contextMenuElement: HTMLElement) => {
    const buttonContainer = document.createElement("div");
    const button = document.createElement("button");
    buttonContainer.style.display = "flex";
    buttonContainer.style.flexDirection = "column";
    buttonContainer.style.alignItems = "end";
    buttonContainer.appendChild(button);
    button.textContent = "Concluir";
    button.className = "e-btn e-outline";
    contextMenuElement.appendChild(buttonContainer);
    return button;
  };

  closeList = () => {
    const contextMenuElement = document.getElementById(
      "contextmenu-iara"
    ) as HTMLElement;
    if (contextMenuElement) {
      contextMenuElement.style.display = "none";
      contextMenuElement.remove();
    }
    this._instance._documentEditor.isReadOnly = false;
  };
}
