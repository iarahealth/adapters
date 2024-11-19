import {
  DocumentEditor,
  DocumentEditorKeyDownEventArgs,
} from "@syncfusion/ej2-documenteditor";
import { ListView } from "@syncfusion/ej2-lists";
import { Dialog } from "@syncfusion/ej2-popups";
import { IaraEditorConfig } from "../../editor";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionAIAssistant } from "../assistant";
import { IaraSyncfusionContentManager } from "../content";
import { IaraSyncfusionNavigationFieldManager } from "../navigationFields";
import { IaraSyncfusionTemplateSearch } from "./templateSearch";

export class IaraSyncfusionShortcutsManager {
  constructor(
    private _editor: DocumentEditor,
    private _recognition: IaraSpeechRecognition,
    private _contentManager: IaraSyncfusionContentManager,
    private _config: IaraEditorConfig,
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
        this.shortcutByAt(args);
        break;
      case "Tab":
        args.isHandled = true;
        this.shortcutByTabAndShiftTab(args);
        break;
      default:
        break;
    }
  }

  shortcutByAt(args: DocumentEditorKeyDownEventArgs): void {
    args.isHandled = true;
    args.event.preventDefault();

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

  shortcutByTabAndShiftTab(args: DocumentEditorKeyDownEventArgs): void {
    if (args.event.shiftKey && args.event.key == "Tab") {
      this._navigationFieldManager.previousField(true);
    } else if (args.event.key == "Tab") {
      this._navigationFieldManager.nextField(true);
    }
  }

  async onSlashShortcut(args: DocumentEditorKeyDownEventArgs): Promise<void> {
    args.isHandled = true;
    args.event.preventDefault();
    new IaraSyncfusionAIAssistant(
      this._editor,
      this._recognition,
      this._contentManager,
      this._config
    );
  }
}
