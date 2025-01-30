import { ListView } from "@syncfusion/ej2-lists";
import { IaraSyncfusionNavigationFieldManager } from "..";
import { IaraAdditiveBookmark } from "../navigationBookmark";

export class IaraSyncfusionAdditiveList {
  private _list: ListView = new ListView();
  private _fieldsSelected: string[] = [];

  constructor(private _instance: IaraSyncfusionNavigationFieldManager) {}

  create = (additiveField: IaraAdditiveBookmark, additiveId: string) => {
    let fieldSelected: string[] = [];
    this._list = new ListView({
      dataSource: this.createItems(additiveField),
      showCheckBox: true,
      width: "200px",
      select: (args: {
        data: { text: string; value: string };
        isChecked: boolean;
      }) => {
        if (args.isChecked) {
          this._instance.selectBookmark(additiveId);
          if (!fieldSelected.includes(`${additiveId}-${args.data.text}`))
            fieldSelected = [...fieldSelected, args.data.value];
        } else {
          fieldSelected = fieldSelected.filter(additive => {
            return (
              `${additiveId}-${additive}` !== `${additiveId}-${args.data.text}`
            );
          });
        }
      },
    });
    const contextMenuElement = document.createElement("ul");
    contextMenuElement.id = "contextmenu-iara";
    this._instance._documentEditor.documentHelper.viewerContainer.appendChild(
      contextMenuElement
    );

    this._list.appendTo("#contextmenu-iara");
    this.customPosition();
    this.customStyle();
    const btn = this.customButton(contextMenuElement);
    btn.onclick = () => this.addContent(fieldSelected, additiveField);
    this._instance._documentEditor.isReadOnly = true;
  };

  addContent = (
    fieldSelected: string[],
    additiveField: IaraAdditiveBookmark
  ) => {
    this.hide();
    fieldSelected.map((fileChecked, index) => {
      this._instance._documentEditor.editor.insertText(fileChecked);
      if (fieldSelected.length - 2 === index) {
        this._instance._documentEditor.editor.insertText(
          ` ${additiveField.delimiterEnd} `
        );
      } else if (fieldSelected.length - 1 !== index) {
        this._instance._documentEditor.editor.insertText(
          `${additiveField.delimiterStart} `
        );
      }
    });
  };

  customStyle = () => {
    this._list.element.style.margin = "0";
    this._list.element.style.padding = "0";
    this._list.element.style.zIndex = "999";
    this._list.element.style.borderColor = "#BAE1FE";
    this._list.element.style.borderRadius = "5px";
    this._list.element.style.borderStyle = "dotted";
    this._list.element.style.borderWidth = "1px";
  };

  customPosition = () => {
    const documentEditorContainer =
      this._instance._documentEditor.element.getBoundingClientRect();
    const textPosition =
      this._instance._documentEditor.selection.start.location;
    const rulerOffset =
      this._instance._documentEditor.hRuler.element.getBoundingClientRect();
    const yPos = rulerOffset.top + textPosition.y;
    const xPos =
      rulerOffset.left + textPosition.x - documentEditorContainer.left;
    this._list.element.style.position = "absolute";
    this._list.element.style.top = `${yPos}px`;
    this._list.element.style.left = `${xPos}px`;
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

  createItems = (additiveField: IaraAdditiveBookmark) => {
    return additiveField.additiveTexts.map(text => {
      return {
        text: text.identifier,
        value: text.phrase,
      };
    });
  };

  selectItem = (
    args: {
      data: { text: string; value: string };
      isChecked: boolean;
    },
    additiveId: string
  ) => {
    if (args.isChecked) {
      this._instance.selectBookmark(additiveId);
      if (!this._fieldsSelected.includes(`${additiveId}-${args.data.value}`))
        this._fieldsSelected = [...this._fieldsSelected, args.data.value];
    } else {
      this._fieldsSelected = this._fieldsSelected.filter(additive => {
        return (
          `${additiveId}-${additive}` !== `${additiveId}-${args.data.value}`
        );
      });
    }
  };

  hide = () => {
    const contextMenuElement = document.getElementById(
      "contextmenu-iara"
    ) as HTMLElement;
    if (contextMenuElement) {
      contextMenuElement.remove();
    }
    this._instance._documentEditor.isReadOnly = false;
  };

  show = (additiveField: IaraAdditiveBookmark, additiveId: string) => {
    const contextMenuElement = document.createElement("ul");
    contextMenuElement.id = "contextmenu-iara";
    this._instance._documentEditor.documentHelper.viewerContainer.appendChild(
      contextMenuElement
    );
    this._list.dataSource = this.createItems(additiveField);
    this._list.appendTo("#contextmenu-iara");
    this._list.select(
      (args: { data: { text: string; value: string }; isChecked: boolean }) =>
        this.selectItem(args, additiveId)
    );
    this.customPosition();
    this.customStyle();
    const btn = this.customButton(contextMenuElement);
    btn.onclick = () => this.addContent(this._fieldsSelected, additiveField);
    this._instance._documentEditor.isReadOnly = true;
  };
}
