import EJ2_LOCALE_PT_BR from "@syncfusion/ej2-locale/src/pt-BR.json";
import EJ2_LOCALE_ES from "@syncfusion/ej2-locale/src/es.json";

export interface IaraLanguages {
  language: {
    syncfusionTranslate:
      | (typeof EJ2_LOCALE_ES)["es"]
      | (typeof EJ2_LOCALE_PT_BR)["pt-BR"];
    iaraTranslate: {
      customfields: {
        header: string;
        content: string;
        add: string;
        mandatory: string;
        optional: string;
        additive: string;
        next: string;
        previous: string;
      };
      changes: { trackchanges: string; header: string };
      saveMessage: {
        success: string;
        error: string;
        loading: string;
      };
      additiveFieldModal: {
        modalTitle: string;
        titleField: string;
        titlePlaceholder: string;
        configTitle: string;
        delimiterStartField: string;
        delimiterStartRequired: string;
        delimiterFinalField: string;
        delimiterFinalPlaceholder: string;
        delimiterFinalRequired: string;
        additiveTextsTitle: string;
        additiveTextsHeaderIdentifier: string;
        additiveTextsHeaderPhrase: string;
        addTextBtn: string;
        modalBtnOk: string;
        modalBtnCancel: string;
      };
    };
  };
}
