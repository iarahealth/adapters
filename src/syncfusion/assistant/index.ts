import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { IaraEditorConfig } from "../../editor";
import { IaraSpeechRecognition } from "../../speech";

export class IaraSyncfusionAIAssistant {
  constructor(
    private _editor: DocumentEditor,
    private _recognition: IaraSpeechRecognition,
    private _config: IaraEditorConfig
  ) {
    this._createAssistantElement().then(assistant => {
      // Disable speech recognition while assistant is open,
      // and re-enable it when the assistant is closed (if it was enabled before)
      const enableSpeechRecognition = this._config.enableSpeechRecognition;
      this._config.enableSpeechRecognition = false;
      assistant.addEventListener("action", (event: Event) => {
        const detail = (event as CustomEvent).detail;
        if (detail.id == "close") {
          this._config.enableSpeechRecognition = enableSpeechRecognition;
        }
      });
    });
  }

  private async _createAssistantElement(): Promise<
    HTMLElement & { recognition: IaraSpeechRecognition; report: string }
  > {
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
    // assistant.report = await this._contentManager.getPlainTextContent();
    assistant.recognition = this._recognition;
    assistant.style.zIndex = "1000";
    assistant.addEventListener("diagnosticImpression", (event: Event) => {
      console.log(event);
      // this.insertDiagnosticImpression((event as CustomEvent).detail);
    });
    assistant.addEventListener("report", (event: Event) => {
      console.log(event);
      // this.insertDiagnosticImpression((event as CustomEvent).detail);
    });

    container.appendChild(assistant);
    this._editor.documentHelper.viewerContainer.appendChild(container);

    return assistant;
  }

  // private insertDiagnosticImpression(diagnosticImpression: string): void {
  //   let matchedQuery = "";
  //   const queries = [
  //     `Conclusão:`,
  //     `Hipótese diagnóstica:`,
  //     `Impressão Diagnóstica:`,
  //     `Impressão:`,
  //     `Resumo:`,
  //     `Observação:`,
  //     `Observações:`,
  //     `Opinião:`,
  //   ];
  //   while (!matchedQuery && queries.length) {
  //     const query = queries.shift();
  //     if (!query) continue;
  //     this._editor.search.findAll(query);
  //     if (this._editor.search.searchResults.length) {
  //       matchedQuery = query;
  //     }
  //   }
  //   let impressionTitle = `Impressão diagnóstica:`;
  //   if (matchedQuery) {
  //     const searchResult = this._editor.search.searchResults
  //       .getTextSearchResultsOffset()
  //       .pop();
  //     if (!searchResult) return;

  //     const { startOffset } = searchResult;
  //     this._editor.search.searchResults.clear();
  //     this._editor.selection.moveToDocumentEnd();
  //     this._editor.selection.select(
  //       startOffset,
  //       this._editor.selection.endOffset
  //     );
  //     this._editor.editor.delete();
  //     impressionTitle = matchedQuery;
  //   } else {
  //     this._editor.selection.moveToDocumentEnd();
  //   }
  //   this._editor.editor.toggleBold();
  //   this.insertText(impressionTitle);
  //   this.insertParagraph();
  //   this._editor.editor.toggleBold();
  //   this.insertText(diagnosticImpression);
  // }
}
