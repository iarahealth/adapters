import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { IaraEditorConfig } from "../../editor";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionContentManager } from "../content";
import { diffWords } from "../content/jsdiff/src";

export class IaraSyncfusionAIAssistant {
  constructor(
    private _editor: DocumentEditor,
    private _recognition: IaraSpeechRecognition,
    private _contentManager: IaraSyncfusionContentManager,
    private _config: IaraEditorConfig
  ) {
    this._createAssistantElement();
  }

  private async _createAssistantElement(): Promise<
    HTMLElement & { recognition: IaraSpeechRecognition; report: string }
  > {
    this._editor.isReadOnly = true;

    const hRulerBounds = this._editor.hRuler.element.getBoundingClientRect();
    const textPosition = this._editor.selection.start.location;

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = `${Math.ceil(
      textPosition.y + this._editor.selection.characterFormat.fontSize * 3.5
    )}px`;
    container.style.left = `${hRulerBounds.left}px`;
    container.style.zIndex = "1000";

    const assistant = document.createElement(
      "iara-ai-assistant"
    ) as HTMLElement & { recognition: IaraSpeechRecognition; report: string };
    assistant.report = await this._contentManager.reader.getPlainTextContent();
    assistant.recognition = this._recognition;
    assistant.style.zIndex = "1000";
    assistant.addEventListener("diagnosticImpression", (event: Event) => {
      this._insertDiagnosticImpression((event as CustomEvent).detail);
    });
    assistant.addEventListener("report", (event: Event) => {
      this._insertReport((event as CustomEvent).detail);
    });

    // Disable speech recognition while assistant is open,
    // and re-enable it when the assistant is closed (if it was enabled before)
    const enableSpeechRecognition = this._config.enableSpeechRecognition;
    this._config.enableSpeechRecognition = false;
    assistant.addEventListener("action", (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail.id == "close") {
        this._config.enableSpeechRecognition = enableSpeechRecognition;
        this._editor.isReadOnly = false;
      }
    });

    assistant.addEventListener("stepChange", async (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail.sourceComponentName == "GenerateReportActionMenu") {
        if (!detail.data.template) return;

        await this._contentManager.writer.insertTemplate(
          detail.data.template.replaceText,
          true
        );
        const template = Object.values(
          this._recognition.richTranscriptTemplates.templates
        ).find(template => template.key == detail.data.template.key);
        if (!template) return;

        this._recognition.richTranscriptTemplates.templates[
          template.key
        ].metadata = {
          ...(template.metadata as Object || {}),
          plainReplaceText:
            await this._contentManager.reader.getPlainTextContent(),
        };
      }
    });

    container.appendChild(assistant);
    this._editor.documentHelper.viewerContainer.appendChild(container);

    return assistant;
  }

  private _insertDiagnosticImpression(diagnosticImpression: string): void {
    this._editor.isReadOnly = false;

    let matchedQuery = "";
    const queries = [
      `Conclusão:`,
      `Hipótese diagnóstica:`,
      `Impressão Diagnóstica:`,
      `Impressão:`,
      `Resumo:`,
      `Observação:`,
      `Observações:`,
      `Opinião:`,
    ];
    while (!matchedQuery && queries.length) {
      const query = queries.shift();
      if (!query) continue;
      this._editor.search.findAll(query);
      if (this._editor.search.searchResults.length) {
        matchedQuery = query;
      }
    }
    let impressionTitle = `Impressão diagnóstica:`;
    if (matchedQuery) {
      const searchResult = this._editor.search.searchResults
        .getTextSearchResultsOffset()
        .pop();
      if (!searchResult) return;

      const { startOffset } = searchResult;
      this._editor.search.searchResults.clear();
      this._editor.selection.moveToDocumentEnd();
      this._editor.selection.select(
        startOffset,
        this._editor.selection.endOffset
      );
      this._editor.editor.delete();
      impressionTitle = matchedQuery;
    } else {
      this._editor.selection.moveToDocumentEnd();
    }
    this._editor.editor.toggleBold();
    this._contentManager.writer.insertText(impressionTitle);
    this._contentManager.writer.insertParagraph();
    this._editor.editor.toggleBold();
    this._contentManager.writer.insertText(diagnosticImpression);
  }

  private async _insertReport(report: string): Promise<void> {
    const previousContent =
      await this._contentManager.reader.getPlainTextContent();

    this._editor.isReadOnly = false;
    this._contentManager.writer.clear();
    this._editor.enableTrackChanges = false;

    const diff = diffWords(previousContent, report);

    for (const change of diff) {
      this._editor.selection.moveToDocumentEnd();
      if (change.added) {
        this._editor.enableTrackChanges = true;
        this._contentManager.writer.insertText(change.value);
      } else if (!change.removed) {
        this._editor.enableTrackChanges = false;
        this._contentManager.writer.insertText(change.value);
      }
    }

    this._editor.enableTrackChanges = false;
    this._contentManager.writer.formatSectionTitles();
    this._contentManager.writer.formatTitle();
  }
}
