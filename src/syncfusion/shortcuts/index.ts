import {
  DocumentEditor,
  DocumentEditorKeyDownEventArgs,
} from "@syncfusion/ej2-documenteditor";
import { ListView } from "@syncfusion/ej2-lists";
import { Dialog } from "@syncfusion/ej2-popups";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionEditorContentManager } from "../content";
import { IaraSyncfusionNavigationFieldManager } from "../navigationFields";
import { IaraSyncfusionTemplateSearch } from "./templateSearch";

export class IaraSyncfusionShortcutsManager {
  constructor(
    private _editor: DocumentEditor,
    private _recognition: IaraSpeechRecognition,
    private _contentManager: IaraSyncfusionEditorContentManager,
    private _navigationFieldManager: IaraSyncfusionNavigationFieldManager,
    private onTemplateSelected: (
      listViewInstance: ListView,
      dialogObj: Dialog
    ) => void
  ) {
    this._editor.keyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    switch (args.event.key) {
      case "@":
        this.onAtShortcut();
        break;
      case "Tab":
        args.isHandled = true;
        this.onTabAndShiftTabShortcut(args);
        break;
      case "/":
        this.onSlashShortcut();
        break;
      default:
        break;
    }
  }

  onAtShortcut(): void {
    const templates = [
      ...Object.values(this._recognition.richTranscriptTemplates.templates),
    ];

    const updateFormatTemplates = templates.map(template => {
      const metadata = template.metadata as {
        category: string;
        name: string;
        id: number;
      };
      return {
        name: metadata.name,
        category: metadata.category ? metadata.category : "",
        content: template.replaceText,
        id: metadata.id,
      };
    });

    const sortOrder = updateFormatTemplates.sort((oldTemplate, newTemplate) => {
      // Compare based on the 'type' key
      if (oldTemplate.category === newTemplate.category) {
        // If types are the same, order by the 'value' key
        return oldTemplate["name"].localeCompare(newTemplate["name"]);
      } else {
        // Order 'template' items first
        return oldTemplate.category === "Template" ? -1 : 1;
      }
    });
    new IaraSyncfusionTemplateSearch(sortOrder, this.onTemplateSelected);
  }

  onTabAndShiftTabShortcut(args: DocumentEditorKeyDownEventArgs): void {
    if (args.event.shiftKey && args.event.key == "Tab") {
      this._navigationFieldManager.previousField(true);
    } else if (args.event.key == "Tab") {
      this._navigationFieldManager.nextField(true);
    }
  }

  async onSlashShortcut(): Promise<void> {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "100px";
    container.style.left = "100px";
    container.style.zIndex = "1000";

    const assistant = document.createElement(
      "iara-ai-assistant"
    ) as HTMLElement & { recognition: IaraSpeechRecognition; report: string };
    assistant.report = await this._contentManager.getPlainTextContent();
    assistant.recognition = this._recognition;
    assistant.style.zIndex = "1000";

    container.appendChild(assistant);
    this._editor.documentHelper.viewerContainer.appendChild(container);
  }
}
