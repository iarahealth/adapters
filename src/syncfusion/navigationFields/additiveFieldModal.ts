import { Button } from "@syncfusion/ej2-buttons";
import { TextBox } from "@syncfusion/ej2-inputs";
import { ListView } from "@syncfusion/ej2-lists";
import { DialogUtility } from "@syncfusion/ej2-popups";
import { IaraSyncfusionLanguageManager } from "../language";

export class IaraSyncfusionAdditiveFieldModal {
  constructor(private _languageManager: IaraSyncfusionLanguageManager) {
    let countValue = 0;
    const okClick = () => {
      //funcao para gravar todos os dados
      console.log("Additive OK");
    };

    const cancelClick = () => {
      dialogUtility.hide();
      console.log("Additive Cancel");
    };

    const inputContentText = `
      <div style="display: flex; align-items: center;">
        <div style="display: flex; flex-direction: column;">
          <h5 style="text-transform: uppercase; margin: 4px;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.additiveTextsHeaderIdentifier}:</h5>
          <div style="display: flex;">
            <input style="width: stretch;" type="text" id="identifier" name="identifier" required="">
          </div>
        </div>
        <div style="width: 80px; display: flex; align-items: center; justify-content: center; margin-top: 15px;" >
          <span class='e-icons e-arrow-right e-large'></span>
        </div>
        <div style="display: flex; flex-direction: column;">
          <h5 style="text-transform: uppercase; margin: 4px;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.additiveTextsHeaderPhrase}:</h5>
          <div style="display: flex;">
            <input style="width: stretch;" type="text" id="phrase" name="phrase" required="">
          </div>
        </div>
      </div>
    `;

    const formContentText = `
      <form id="formContentId" onsubmit="return false">
        ${inputContentText}
        <button id="addBtn" type='submit' style="margin-top: 6px;">Adicionar Texto</button>
      </form>
      `;

    const content = `
        <form id="formId" class="form-horizontal">

          <div class="tab" style="border-bottom: 1px solid #e0e0e0;">
            <div class="form-group">

              <div style="display: flex; align-items: center;">
                <div style="display: flex;">
                  <h5>${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.titleField}:</h5>
                </div>
                <div style="display: flex; flex-grow: 10; padding-left: 1rem;">
                    <input id="outlined" style="width: 100%;"/>
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
        </form>
        <div class="tab">
          <h3 style="margin: 1rem 0 .5rem 0;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.additiveTextsTitle}</h3>
          ${formContentText}
          <div id='listview' style="overflow: auto; max-height: 300px; margin-top: 20px;"></div>
        </div>
        `;

    const dialogUtility = DialogUtility.confirm({
      title: `<div class='dlg-template'>${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.modalTitle}</div>`,
      content: content,
      width: "450px",
      showCloseIcon: true,
      closeOnEscape: true,
      cancelButton: {
        text: this._languageManager.languages.language.iaraTranslate
          .additiveFieldModal.modalBtnCancel,
        click: cancelClick,
      },
      okButton: {
        text: this._languageManager.languages.language.iaraTranslate
          .additiveFieldModal.modalBtnOk,
        click: okClick,
      },
    });

    let dataSource: {
      count: number;
      identifier: string;
      phrase: string;
    }[] = [];

    const listTemplate = (data: {
      identifier: string;
      phrase: string;
      count: number;
    }) => `<div style="overflow: auto;">
        <div style="display: flex; align-items: center; justify-content: center;">
          <div style="width: 30px; display: flex; align-items: center; justify-content: center;">
            ${data.count} <span class='e-icons e-drag-and-drop'></span>
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

    const listviewInstance = new ListView({
      dataSource,
      template: listTemplate,
      fields: { iconCss: "icon" },
      actionComplete: onComplete,
    });
    listviewInstance.appendTo("#listview");

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

    const form = document.getElementById("formContentId") as HTMLFormElement;

    const onSubmit = (event: Event) => {
      event.preventDefault();
      countValue += 1;
      const identifier = document.getElementById(
        "identifier"
      ) as HTMLInputElement;
      const phrase = document.getElementById("phrase") as HTMLInputElement;
      dataSource = [
        {
          identifier: identifier.value,
          phrase: phrase.value,
          count: countValue,
        },
      ];
      identifier.value = "";
      phrase.value = "";
      listviewInstance.addItem(dataSource);
      onComplete();
    };

    form.addEventListener("submit", onSubmit);

    function onComplete() {
      const iconEle: HTMLCollection =
        document.getElementsByClassName("delete-icon");

      Array.prototype.forEach.call(iconEle, (element: HTMLElement) => {
        element.addEventListener("click", () => {
          countValue -= 1;
          const li: HTMLElement = element.closest("li") as HTMLElement;
          li.remove();
        });
      });
    }
  }
}
