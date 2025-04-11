import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { diffWords } from "diff";
import { v4 as uuidv4 } from "uuid";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionConfig } from "../config";
import { IaraSyncfusionContentManager } from "../content";

export class IaraSyncfusionAIAssistant {
  constructor(
    private _editor: DocumentEditor,
    private _recognition: IaraSpeechRecognition,
    private _contentManager: IaraSyncfusionContentManager,
    private _config: IaraSyncfusionConfig
  ) {
    if (document.querySelector("iara-ai-assistant")) return;
    this._createAssistantElement();
  }

  private _addBookmark(bookmarkContent: string) {
    const bookmarkId = `assistantId_${uuidv4()}`;
    this._editor.editor.insertBookmark(bookmarkId);
    this._contentManager.writer.insertText(bookmarkContent);
    this._editor.selection.selectBookmark(bookmarkId);
    this._highlightSelection();
    this._editor.selection.clear();
  }

  private async _createAssistantElement(): Promise<
    HTMLElement & { recognition: IaraSpeechRecognition; report: string }
  > {
    this._editor.isReadOnly = true;

    const firstPageBounds =
      this._editor.viewer.visiblePages[0].boundingRectangle;
    const textPosition = this._editor.selection.start.location;
    const textXPadding = this._editor.viewer.clientArea.x + firstPageBounds.x;
    const buttonSize = 24;
    const buttonPadding = 14;

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.width = "600px";
    container.style.top = `${Math.ceil(
      firstPageBounds.y +
        textPosition.y -
        this._editor.selection.characterFormat.fontSize * 0.35
    )}px`;
    if (this._editor.viewer.clientArea.x === firstPageBounds.x) {
      container.style.right = `${textXPadding + buttonSize + buttonPadding}px`;
    } else container.style.left = `${textXPadding}px`;
    container.style.zIndex = "1000";

    const assistant = document.createElement(
      "iara-ai-assistant"
    ) as HTMLElement & {
      recognition: IaraSpeechRecognition;
      report: string;
      settings: Record<string, any>;
    };
    let reportContent = await this._contentManager.reader.getPlainTextContent();
    if (
      reportContent.charCodeAt(0) === 13 ||
      reportContent === "" ||
      reportContent.startsWith(" ")
    )
      reportContent = "";
    assistant.report = reportContent;
    assistant.recognition = this._recognition;
    assistant.settings = this._config.assistant;
    assistant.style.zIndex = "1000";
    assistant.addEventListener("diagnosticImpression", (event: Event) => {
      const detail = (
        event as CustomEvent<{
          diagnosticImpression: string;
          input: Record<string, unknown>;
        }>
      ).detail;
      this._insertDiagnosticImpression(detail.diagnosticImpression);
      dispatchEvent(
        new CustomEvent("IaraAssistantDiagnosticImpression", { detail })
      );
    });
    assistant.addEventListener("report", (event: Event) => {
      const detail = (
        event as CustomEvent<{ report: string; input: Record<string, unknown> }>
      ).detail;
      this._insertReport(detail.report);
      dispatchEvent(new CustomEvent("IaraAssistantReport", { detail }));
      this._recognition.start();
    });

    assistant.addEventListener("definedSettings", (event: Event) => {
      const detail = (
        event as CustomEvent<{
          impression: {
            itemizedOutput: boolean;
          };
          user_rules: {
            report: string[];
          };
        }>
      ).detail;
      dispatchEvent(
        new CustomEvent("IaraAssistantDefinedSettings", { detail })
      );
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
        assistant.remove();
      }
    });

    assistant.addEventListener("stepChanged", async (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail.componentName == "GenerateReportInput") {
        if (!detail.data.template) return;

        await this._contentManager.writer.insertTemplate(
          detail.data.template.replaceText,
          true
        );

        // Focus the textarea after the template is inserted
        // This will not work withour a setTimeout, even if it is 0,
        // as this is handled differently by the browser
        setTimeout(() => {
          assistant.shadowRoot?.querySelector("textarea")?.focus();
        }, 0);

        const template = Object.values(
          this._recognition.richTranscriptTemplates.templates
        ).find(template => template.key == detail.data.template.key);
        if (!template) return;

        this._recognition.richTranscriptTemplates.templates[
          template.key
        ].metadata = {
          ...((template.metadata as object) || {}),
          plainReplaceText:
            await this._contentManager.reader.getPlainTextContent(),
        };
      }
    });

    container.appendChild(assistant);
    this._editor.documentHelper.viewerContainer.appendChild(container);

    return assistant;
  }

  private _ensureParagraphsForDiagnosticInsertion() {
    this._editor.selection.extendToLineStart();
    this._editor.selection.select(
      this._editor.selection.startOffset,
      this._editor.selection.endOffset
    );
    let lineContent = this._editor.selection.text;
    //charCode 13 line break
    while (
      lineContent.charCodeAt(0) === 13 ||
      lineContent === "" ||
      lineContent.startsWith(" ")
    ) {
      this._editor.selection.moveToPreviousLine();
      this._editor.selection.extendToLineEnd();
      lineContent = this._editor.selection.text;
      continue;
    }
    this._editor.selection.moveToLineEnd();
    this._contentManager.writer.insertParagraph();
    this._contentManager.writer.insertParagraph();
  }

  private _highlightSelection(): void {
    this._config.darkMode
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        (this._editor.selection.characterFormat.highlightColor = "#0e5836")
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        (this._editor.selection.characterFormat.highlightColor = "#ccffe5");
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
    this._ensureParagraphsForDiagnosticInsertion();
    if (!this._editor.selection.characterFormat.bold)
      this._editor.editor.toggleBold();
    this._contentManager.writer.insertText(impressionTitle);
    this._contentManager.writer.insertParagraph();
    if (this._editor.selection.characterFormat.bold)
      this._editor.editor.toggleBold();
    this._contentManager.writer.insertText(diagnosticImpression);
  }

  private async _insertReport(report: string): Promise<void> {
    const previousContent =
      await this._contentManager.reader.getPlainTextContent();

    this._editor.isReadOnly = false;
    this._contentManager.writer.clear();

    const diff = diffWords(previousContent, report);
    for (const change of diff) {
      this._editor.selection.moveToDocumentEnd();
      if (change.added) {
        this._addBookmark(change.value);
      } else if (!change.removed) {
        this._editor.selection.characterFormat.highlightColor = "NoColor";
        this._contentManager.writer.insertText(change.value);
      }
    }

    this._contentManager.writer.formatSectionTitles();
    this._contentManager.writer.formatTitle();
    this._editor.selection.moveToDocumentEnd();
  }
}
