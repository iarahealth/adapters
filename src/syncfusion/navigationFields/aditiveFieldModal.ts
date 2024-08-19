import { Button } from "@syncfusion/ej2-buttons";
import { TextBox } from "@syncfusion/ej2-inputs";
import { ListView } from "@syncfusion/ej2-lists";
import { Dialog, DialogUtility } from "@syncfusion/ej2-popups";
import * as Sortable from "sortablejs";
import { IaraSyncfusionLanguageManager } from "../language";
import { SortableList } from "./navigationBookmark";

export class IaraSyncfusionAditiveFieldModal {
  public content = "";
  public dataSource: {
    identifier: string;
    phrase: string;
  }[] = [];
  public dialogUtility: Dialog;
  public inputContentText = "";
  public formContentText = "";
  public listTemplate: (data: { identifier: string; phrase: string }) => string;
  public listviewInstance: ListView;
  public requiredField = false;

  constructor(
    private _languageManager: IaraSyncfusionLanguageManager,
    public onSubmit: (
      event: Event,
      listView: ListView,
      dialogObj: Dialog
    ) => void
  ) {
    this.inputContentText = `
      <div style="display: flex; align-items: center;">
        <div style="display: flex; flex-direction: column;">
          <h5 style="text-transform: uppercase; margin: 4px;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.additiveTextsHeaderIdentifier}:</h5>
          <div style="display: flex;">
            <input style="width: stretch;" type="text" id="identifier" name="identifier">
          </div>
        </div>
        <div style="width: 80px; display: flex; align-items: center; justify-content: center; margin-top: 15px;" >
          <span class='e-icons e-arrow-right e-large'></span>
        </div>
        <div style="display: flex; flex-direction: column;">
          <h5 style="text-transform: uppercase; margin: 4px;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.additiveTextsHeaderPhrase}:</h5>
          <div style="display: flex;">
            <input style="width: stretch;" type="text" id="phrase" name="phrase">
          </div>
        </div>
      </div>
    `;

    this.content = `
        <form id="formContentId" class="form-horizontal">
          <div class="tab" style="border-bottom: 1px solid #e0e0e0;">
            <div class="form-group">
              <div style="display: flex; align-items: center;">
                <div style="display: flex;">
                  <h5>${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.titleField}:</h5>
                </div>
                <div style="display: flex; flex-grow: 10; padding-left: 1rem;">
                    <input id="outlined" style="width: 100%;" required=""/>
                </div>
              </div>
            </div>
          </div>
          <div class="tab" style="border-bottom: 1px solid #e0e0e0;">
              <h3 style="margin: 1rem 0 .5rem 0;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.configTitle}</h3>
              <div style="display: flex; align-items: center;">
                <div style="display: flex;">
                  <h5 style="margin-right: 1rem;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.delimiterStartField}:</h5>
                </div>
                <div style="display: flex;">
                  <input style="width: stretch;"
                    type="text" id="delimiter-start" name="delimiter-start"
                    data-required-message="*${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.delimiterStartRequired}" required=""
                    data-msg-containerid="delimiterError" placeholder="," value=",">
                  <div id="delimiterError"></div>
                </div>
                <div style="display: flex;">
                  <h5 style="white-space: nowrap; margin: 0 1rem;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.delimiterFinalField}:</h5>
                </div>
                <div style="display: flex;">
                  <input style="width: stretch;"
                    type="text" id="delimiter-end" name="delimiter-end"
                    data-required-message="*${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.delimiterFinalRequired}" required=""
                    data-msg-containerid="finalDelimiterError"
                    placeholder="${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.delimiterFinalPlaceholder}"
                    value="${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.delimiterFinalPlaceholder}">
                  <div id="finalDelimiterError"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="tab">
            <h3 style="margin: 1rem 0 .5rem 0;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.additiveTextsTitle}</h3>
            ${this.inputContentText}
            <button id="addBtn" style="margin-top: 6px;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.addTextBtn}</button>
            <div id='listview' style="overflow: auto; max-height: 300px; margin-top: 20px;"></div>
          </div>
          <div class="e-footer-content">
            <button id="closeModal" class="e-btn e-secondary e-flat" style="margin-top: 6px;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.modalBtnCancel}</button>
            <button class="e-btn e-primary"  type='submit' style="margin-top: 6px;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.modalBtnOk}</button>
          </div>
        </form>
        `;

    this.dialogUtility = DialogUtility.confirm({
      title: `<div class='dlg-template'>${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.modalTitle}</div>`,
      content: this.content,
      width: "450px",
      isModal: false,
      showCloseIcon: true,
      closeOnEscape: true,
      cancelButton: {
        text: "",
        cssClass: "d-none",
      },
      okButton: {
        text: "",
        cssClass: "d-none",
      },
    });

    this.listTemplate = (data: {
      identifier: string;
      phrase: string;
    }) => `<div style="overflow: auto;">
        <div style="display: flex; align-items: center; justify-content: center;">
          <div style="width: 30px; display: flex; align-items: center; justify-content: center;">
            <span class="countValue"></span> <span class='e-icons e-drag-and-drop'></span>
          </div>
          <div>
            <input value="${data.identifier}" style="margin:0px;" class="e-listview e-input-group e-outline" type="text" id="identifiers" name="identifiers" required="">
          </div>
          <div style="width: 80px; display: flex; align-items: center; justify-content: center;" >
            <span class='e-icons e-arrow-right e-large'></span>
          </div>
          <div>
            <input value="${data.phrase}" style="margin:0px;" class="e-listview e-input-group e-outline" type="text" id="phrases" name="phrases" required="">
          </div>
          <div style="width: 30px; display: flex; align-items: center; justify-content: center; margin:2px;">
            <span class="e-icons e-delete-4 delete-icon"></span>
          </div>
        </div>
      </div>`;

    this.listviewInstance = new ListView({
      dataSource: this.dataSource,
      template: this.listTemplate,
      fields: { iconCss: "icon" },
      actionComplete: this.onComplete,
    });
    this.listviewInstance.appendTo("#listview");

    this._addAllComponents();

    const addTextBtn = document.getElementById("addBtn") as HTMLFormElement;
    const closeModal = document.getElementById("closeModal") as HTMLFormElement;

    addTextBtn.addEventListener("click", this.handleClick);
    closeModal.click = () => this.dialogUtility.hide();

    const form = document.getElementById("formContentId") as HTMLFormElement;
    form.addEventListener("submit", event =>
      this.onSubmit(event, this.listviewInstance, this.dialogUtility)
    );

    this.listviewInstance.element.ondrop = () => {
      this.updateNumbersOfList();
    };
  }

  private _addAllComponents = () => {
    const footer = document.getElementsByClassName("e-footer-content");
    footer[1].remove();
    const outlineTextBox: TextBox = new TextBox({
      placeholder:
        this._languageManager.languages.language.iaraTranslate
          .additiveFieldModal.titlePlaceholder,
      cssClass: "e-outline",
    });
    outlineTextBox.appendTo("#outlined");

    const delimeterStart: TextBox = new TextBox({
      placeholder: ",",
      cssClass: "e-outline",
    });
    delimeterStart.appendTo("#delimiter-start");

    const delimeterEnd: TextBox = new TextBox({
      placeholder:
        this._languageManager.languages.language.iaraTranslate
          .additiveFieldModal.delimiterFinalPlaceholder,
      cssClass: "e-outline",
    });
    delimeterEnd.appendTo("#delimiter-end");

    const identifierText: TextBox = new TextBox({
      cssClass: "e-outline e-small",
    });
    identifierText.appendTo("#identifier");

    const phraseText: TextBox = new TextBox({
      cssClass: "e-outline e-small",
    });
    phraseText.appendTo("#phrase");

    const addBtn: Button = new Button({
      cssClass: "e-outline",
      isPrimary: true,
    });
    addBtn.appendTo("#addBtn");
  };

  public handleClick = (event: Event) => {
    event.preventDefault();
    const identifier = document.getElementById(
      "identifier"
    ) as HTMLInputElement;
    const phrase = document.getElementById("phrase") as HTMLInputElement;

    this.dataSource = [
      {
        identifier: identifier.value,
        phrase: phrase.value,
      },
    ];
    identifier.value = "";
    phrase.value = "";
    this.listviewInstance.addItem(this.dataSource);
    this.onComplete();
    this.onDragInDrop();
    this.updateNumbersOfList();
  };

  public onComplete(): void {
    const iconEle: HTMLCollection =
      document.getElementsByClassName("delete-icon");

    Array.prototype.forEach.call(iconEle, (element: HTMLElement) => {
      element.addEventListener("click", () => {
        const li: HTMLElement = element.closest("li") as HTMLElement;
        li.remove();
        this.updateNumbersOfList();
      });
    });
  }

  public onDragInDrop = () => {
    const listView = document.getElementById("listview") as HTMLElement;
    const ul = listView.firstElementChild?.firstElementChild as HTMLElement;
    const sortable = Sortable as unknown as SortableList;
    sortable.default.create(ul);
  };

  public updateNumbersOfList = () => {
    const countList = document.getElementsByClassName("countValue");
    Array.prototype.map.call(countList, (count: HTMLElement, index) => {
      count.textContent = `${index + 1}`;
    });
  };
}
