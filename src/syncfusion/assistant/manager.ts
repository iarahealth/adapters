import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionConfig } from "../config";
import { IaraSyncfusionContentManager } from "../content";
import { IaraSyncfusionAIAssistant } from "./assistant";

export class IaraSyncfusionAIAssistantManager {
  private _assistantButtonContainer?: HTMLElement;
  private readonly _listeners: { key: string; callback: () => void }[] = [];

  constructor(
    private readonly _editor: DocumentEditor,
    private readonly _recognition: IaraSpeechRecognition,
    private readonly _contentManager: IaraSyncfusionContentManager,
    private readonly _config: IaraSyncfusionConfig,
    private readonly _commandBlocker: { blocked: boolean }
  ) {
    this._listeners.push(
      {
        key: "SyncfusionOnSelectionChange",
        callback: () => {
          if (!this._assistantButtonContainer) {
            this._assistantButtonContainer = this._createAssistantContainer();
          }

          if (this._assistantButtonContainer) {
            this._updateContainerPosition(this._assistantButtonContainer);
          }
        },
      },
      {
        key: "IaraAssistantClosed",
        callback: () => {
          this._commandBlocker.blocked = false;
        },
      }
    );

    this._listeners.forEach(({ key, callback }) => {
      addEventListener(key, callback);
    });
    this._recognition.commands.add("aceitar", () => {
      this._editor.revisions.acceptAll();
    });
  }

  public destroy(): void {
    this._listeners.forEach(({ key, callback }) => {
      removeEventListener(key, callback);
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
    container.style.zIndex = "0";

    const assistantButton = document.createElement("iara-button");
    assistantButton.setAttribute(
      "class",
      "btn btn-transparent text-primary px-1 py-0 border-0 shadow-none"
    );
    assistantButton.setAttribute("icon", "stars");

    assistantButton.onclick = () => {
      this._commandBlocker.blocked = true;
      new IaraSyncfusionAIAssistant(
        this._editor,
        this._recognition,
        this._contentManager,
        this._config
      );
    };

    container.appendChild(assistantButton);
    this._editor.documentHelper.viewerContainer.appendChild(container);
    return container;
  }

  private _getContainerPosition(): string[] {
    const firstPageBounds =
      this._editor.viewer.visiblePages[0].boundingRectangle;
    const containerXPosition =
      Math.ceil(this._editor.viewer.pageGap * 1.5) + firstPageBounds.x;
    const textPosition = this._editor.selection.start.location;
    const top = `${Math.ceil(
      firstPageBounds.y +
        textPosition.y -
        this._editor.selection.characterFormat.fontSize * 0.35
    )}px`;

    // With the pages layout, the clientArea is the actual editable area with paddings.
    // Therefore, clientArea.x would be the paddding between the pageBounds and the initial text position.
    // In the continuous layout, the clientArea.x is the same as the pageBounds.x.
    //In this layout, we do not want to add the assistant button in the left padding.
    if (this._editor.viewer.clientArea.x === firstPageBounds.x) {
      const left = `${Math.ceil(
        containerXPosition +
          this._editor.viewer.clientArea.width +
          this._editor.selection.characterFormat.fontSize * 0.35
      )}px`;
      return [left, top];
    }
    const left = `${containerXPosition}px`;

    return [left, top];
  }

  private _updateContainerPosition(container: HTMLElement): void {
    const [left, top] = this._getContainerPosition();
    if (!left || !top) {
      this._assistantButtonContainer?.remove();
      this._assistantButtonContainer = undefined;
      return;
    }

    container.style.left = left;
    container.style.top = top;
  }
}
