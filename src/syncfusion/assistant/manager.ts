import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { IaraEditorConfig } from "../../editor";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionContentManager } from "../content";
import { IaraSyncfusionAIAssistant } from "./assistant";

export class IaraSyncfusionAIAssistantManager {
  private _assistantButtonContainer?: HTMLElement;

  constructor(
    private _editor: DocumentEditor,
    private _recognition: IaraSpeechRecognition,
    private _contentManager: IaraSyncfusionContentManager,
    private _config: IaraEditorConfig
  ) {
    addEventListener("SyncfusionOnSelectionChange", () => {
      if (!this._assistantButtonContainer) {
        this._assistantButtonContainer = this._createAssistantContainer();
      }

      if (this._assistantButtonContainer) {
        this._updateContainerPosition(this._assistantButtonContainer);
      }
    });
  }

  private _createAssistantContainer(): HTMLElement | undefined {
    const [left, top] = this._getContainerPosition();
    if (!left || !top) {
      return;
    }

    const container = document.createElement("div");
    container.style.left = left;
    container.style.position = "absolute";
    container.style.top = top;
    container.style.zIndex = "1000";

    console.log("Creating assistant container", left, top);

    const assistantButton = document.createElement("iara-button");
    assistantButton.setAttribute(
      "class",
      "btn btn-transparent text-primary px-1 py-0 border-0 shadow-none"
    );
    assistantButton.setAttribute("icon", "stars");

    assistantButton.addEventListener("click", () => {
      new IaraSyncfusionAIAssistant(
        this._editor,
        this._recognition,
        this._contentManager,
        this._config
      );
    });

    container.appendChild(assistantButton);
    document.body.appendChild(container);

    return container;
  }

  private _getContainerPosition(): string[] {
    const viewerContainerBounds =
      this._editor.documentHelper.viewerContainer.getBoundingClientRect();
    const firstPageBounds =
      this._editor.viewer.visiblePages[0].boundingRectangle;
    const containerXPosition =
      Math.ceil(this._editor.viewer.pageGap * 1.5) +
      viewerContainerBounds.left +
      firstPageBounds.x;
    const textPosition = this._editor.selection.start.location;

    // Check if the minimum distance between the container and the text is kept
    const startingTextXPosition =
      this._editor.viewer.clientArea.x +
      viewerContainerBounds.left +
      firstPageBounds.x;
    const containerXPadding = 10;
    const spaceBetweenContainerAndText =
      startingTextXPosition - containerXPosition;
    if (spaceBetweenContainerAndText < containerXPadding) {
      return [];
    }
    
    const left = `${containerXPosition}px`;
    const top = `${Math.ceil(
      viewerContainerBounds.top +
        firstPageBounds.y +
        textPosition.y -
        this._editor.selection.characterFormat.fontSize * 0.35
    )}px`;

    return [left, top];
  }

  private _updateContainerPosition(container: HTMLElement): void {
    const [left, top] = this._getContainerPosition();
    if (!left || !top) {
      return;
    }

    container.style.left = left;
    container.style.top = top;
  }
}
