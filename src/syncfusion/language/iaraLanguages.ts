import * as EJ2_LOCALE_PT_BR from "@syncfusion/ej2-locale/src/pt-BR.json";
import * as EJ2_LOCALE_ES from "@syncfusion/ej2-locale/src/es.json";
import { IaraLanguages } from "./language";

export class IaraSyncfusionLanguages {
  public ptBr: IaraLanguages = {
    language: {
      syncfusionTranslate: { ...EJ2_LOCALE_PT_BR["pt-BR"] },
      iaraTranslate: {
        customfields: {
          header: "Marcadores",
          content: "Campos de navegação",
          add: "Adicionar campo",
          mandatory: "Adicionar campo obrigatório",
          optional: "Adicionar campo opcional",
          additive: "Adicionar campo aditivo",
          next: "Próximo campo",
          previous: "Campo anterior",
        },
        changes: { trackchanges: "Rastrear mudanças", header: "Revisão" },
        saveMessage: {
          success: "Salvo",
          error: "Erro ao salvar",
          loading: "Salvando...",
        },
        additiveFieldModal: {
          modalTitle: "Campo de Texto Aditivo",
          titleField: "Título",
          titlePlaceholder: "Digite o Título",
          configTitle: "Configurações",
          delimiterStartField: "Delimitador",
          delimiterStartRequired: "Delimitador é Obrigatório",
          delimiterFinalField: "Delimitador Final",
          delimiterFinalPlaceholder: "e",
          delimiterFinalRequired: "Delimitador Final é Obrigatório",
          additiveTextsTitle: "Textos Aditivos",
          additiveTextsHeaderIdentifier: "Identificador",
          additiveTextsHeaderPhrase: "Frase",
          addTextBtn: "Adicionar texto",
          modalBtnOk: "Salvar Campo",
          modalBtnCancel: "Cancelar",
        },
      },
    },
  };

  public es: IaraLanguages = {
    language: {
      syncfusionTranslate: {
        ...EJ2_LOCALE_ES["es"],
      },
      iaraTranslate: {
        changes: {
          trackchanges: "Rastrear cambios",
          header: "Revisión",
        },
        customfields: {
          header: "Etiquetas",
          content: "Campos de navegación",
          add: "Agregar campo",
          mandatory: "Agregar campo obligatorio",
          optional: "Agregar campo opcional",
          additive: "Agregar campo aditivo",
          next: "Próximo campo",
          previous: "Campo anterior",
        },
        saveMessage: {
          success: "Guardado",
          error: "Error al guardar",
          loading: "Guardando...",
        },
        additiveFieldModal: {
          modalTitle: "Campo de Texto Aditivo",
          titleField: "Título",
          titlePlaceholder: "Ingrese el título",
          configTitle: "Ajustes",
          delimiterStartField: "Delimitador",
          delimiterStartRequired: "El delimitador es obligatorio",
          delimiterFinalField: "Delimitador Final",
          delimiterFinalPlaceholder: "y",
          delimiterFinalRequired: "El delimitador final es obligatorio",
          additiveTextsTitle: "Textos Aditivos",
          additiveTextsHeaderIdentifier: "Identificador",
          additiveTextsHeaderPhrase: "Frase",
          addTextBtn: "Agregar texto",
          modalBtnOk: "Guardar campo",
          modalBtnCancel: "Cerrar",
        },
      },
    },
  };
}
