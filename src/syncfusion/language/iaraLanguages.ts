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
          next: "Próximo campo",
          previous: "Campo anterior",
        },
        changes: { trackchanges: "Rastrear mudanças", header: "Revisão" },
        saveMessage: {
          success: "Salvo",
          error: "Erro ao salvar",
          loading: "Salvando...",
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
          trackchanges: "Seguimiento de los cambios",
          header: "Consulte",
        },
        customfields: {
          header: "Marcadores",
          content: "Campos de navegación",
          add: "Añadir campo",
          mandatory: "Añadir campo obligatorio",
          optional: "Añadir campo opcional",
          next: "Campo siguiente",
          previous: "Campo precedente",
        },
        saveMessage: {
          success: "Guardado",
          error: "Error al guardar",
          loading: "Guardar...",
        },
      },
    },
  };
}
