import {
  DocumentEditor,
  DocumentEditorKeyDownEventArgs,
} from "@syncfusion/ej2-documenteditor";
import { ListView } from "@syncfusion/ej2-lists";
import { Dialog } from "@syncfusion/ej2-popups";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionAIAssistant } from "../assistant";
import { IaraSyncfusionConfig } from "../config";
import { IaraSyncfusionContentManager } from "../content";
import { IaraSyncfusionNavigationFieldManager } from "../navigationFields";
import { IaraSyncfusionTemplateSearch } from "./templateSearch";

export class IaraSyncfusionShortcutsManager {
  constructor(
    private _editor: DocumentEditor,
    private _recognition: IaraSpeechRecognition,
    private _contentManager: IaraSyncfusionContentManager,
    private _config: IaraSyncfusionConfig,
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
        templateIara: boolean;
      };
      return {
        name: metadata.name,
        category: metadata.category ? metadata.category : "",
        content: template.replaceText,
        id: metadata.id,
        templateIara: metadata.templateIara,
      };
    });

    const sortOrder = updateFormatTemplates.sort((a, b) => {
      if (a.category === b.category) {
        if (a.templateIara !== b.templateIara) {
          return a.templateIara ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      } else {
        return a.category === "Template" ? -1 : 1;
      }
    });
    new IaraSyncfusionTemplateSearch(sortOrder, this.onTemplateSelected);
  }

  shortcutByTabAndShiftTab(args: DocumentEditorKeyDownEventArgs): void {
    if (args.event.shiftKey && args.event.key == "Tab") {
      this._navigationFieldManager.previousField(true);
      args.event.preventDefault();
    } else if (args.event.key == "Tab") {
      this._navigationFieldManager.nextField(true);
      args.event.preventDefault();
    }
  }

  async onSlashShortcut(args: DocumentEditorKeyDownEventArgs): Promise<void> {
    args.isHandled = true;
    args.event.preventDefault();
    this._editor.selection.select(
      this._editor.selection.startOffset,
      this._editor.selection.endOffset
    );

    new IaraSyncfusionAIAssistant(
      this._editor,
      this._recognition,
      this._contentManager,
      this._config
    );
  }
}
