import { ListView } from "@syncfusion/ej2-lists";
import { DialogUtility } from "@syncfusion/ej2-popups";
import { TextBox } from "@syncfusion/ej2-inputs";
import { IaraSyncfusionLanguageManager } from "../language";

export class IaraSyncfusionAdditiveFieldModal {
  constructor(private _languageManager: IaraSyncfusionLanguageManager) {
    const okClick = () => {
      //funcao para gravar todos os dados
      console.log("Additive OK");
    };

    const cancelClick = () => {
      dialogUtility.hide();
      console.log("Additive Cancel");
    };

    const dataSource: {
      Count: number;
      Identification: string;
      Phrase: string;
    }[] = [
      {
        Count: 1,
        Identification: "",
        Phrase: "",
      },
    ];

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
           <div class="tab">
            <h3 style="margin: 1rem 0 .5rem 0;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.additiveTextsTitle}</h3>
            <div style="display: flex;">
                  <h5 style="white-space: nowrap; margin: 0 1rem;">${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.additiveTextsHeaderIdentifier}:</h5>
            </div>
            <div style="display: flex;">
              <input style="width: stretch;"
                type="text" id="additve-text" name="additve-text"
                data-required-message="*${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.additiveTextsHeaderIdentifier}" required=""
                data-msg-containerid="indentifierError">
              <div id="indentifierError"></div>
            </div>
            <div id='listview' style="overflow: auto; max-height: 300px;"></div>
          </div>
        </form>`;

    const dialogUtility = DialogUtility.confirm({
      title: `<div class='dlg-template'>${this._languageManager.languages.language.iaraTranslate.additiveFieldModal.modalTitle}</div>`,
      content: content,
      width: "450px",
      showCloseIcon: true,
      closeOnEscape: true,
      okButton: {
        text: this._languageManager.languages.language.iaraTranslate
          .additiveFieldModal.modalBtnOk,
        click: okClick,
      },
      cancelButton: {
        text: this._languageManager.languages.language.iaraTranslate
          .additiveFieldModal.modalBtnCancel,
        click: cancelClick,
      },
    });

    const listviewInstance = new ListView({
      dataSource,
      sortOrder: "None",
      fields: { text: "name" },
      template: "",
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

    const additveText: TextBox = new TextBox({
      cssClass: "e-outline",
    });
    additveText.appendTo("#additve-text");
  }
}
