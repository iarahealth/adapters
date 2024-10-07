import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { IaraEditorConfig } from "../../editor";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionContentManager } from "../content";
import { IaraSyncfusionAIAssistant } from "./assistant";

export class IaraSyncfusionAIAssistantManager {
  private _assistantButtonContainer: HTMLElement;

  constructor(
    private _editor: DocumentEditor,
    private _recognition: IaraSpeechRecognition,
    private _contentManager: IaraSyncfusionContentManager,
    private _config: IaraEditorConfig
  ) {
    this._assistantButtonContainer = this._createAssistantContainer();
    addEventListener("SyncfusionOnSelectionChange", () => {
      this._updateAssistantContainerPosition(this._assistantButtonContainer);
    });
  }

  private _createAssistantContainer(): HTMLElement {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.zIndex = "99";

    const assistantButton = document.createElement("button");
    assistantButton.innerHTML = "AI";
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

  private _updateAssistantContainerPosition(container: HTMLElement): void {
    const viewerContainerBounds =
      this._editor.documentHelper.viewerContainer.getBoundingClientRect();
    const firstPageBounds =
      this._editor.viewer.visiblePages[0].boundingRectangle;
    const textPosition = this._editor.selection.start.location;
    const textXPadding =
      Math.ceil(this._editor.viewer.pageGap * 1.5) +
      viewerContainerBounds.left +
      firstPageBounds.x;

    container.style.top = `${Math.ceil(
      viewerContainerBounds.top +
        firstPageBounds.y +
        textPosition.y -
        this._editor.selection.characterFormat.fontSize * 0.25
    )}px`;
    container.style.left = `${textXPadding}px`;
  }
}
