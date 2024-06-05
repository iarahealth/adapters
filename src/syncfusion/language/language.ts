import * as EJ2_LOCALE_PT_BR from "@syncfusion/ej2-locale/src/pt-BR.json";
import * as EJ2_LOCALE_ES from "@syncfusion/ej2-locale/src/es.json";

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
        next: string;
        previous: string;
      };
      changes: { trackchanges: string; header: string };
      saveMessage: {
        success: string;
        error: string;
        loading: string;
      };
    };
  };
}
