import {
  DocumentEditor,
  DocumentEditorKeyDownEventArgs,
} from "@syncfusion/ej2-documenteditor";
import { ListView } from "@syncfusion/ej2-lists";
import { Dialog } from "@syncfusion/ej2-popups";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionTemplateSearch } from "./templateSearch";

export class IaraSyncfusionShortcutsManager {
  constructor(
    private _editor: DocumentEditor,
    private _recognition: IaraSpeechRecognition,
    private onTemplateSelected: (
      listViewInstance: ListView,
      dialogObj: Dialog
    ) => void
  ) {
    this._editor.keyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    if (args.event.key === "@") {
      const templates = [
        ...Object.values(this._recognition.richTranscriptTemplates.templates),
      ];

      const updateFormatTemplates = templates.map(template => {
        const metadata = template.metadata as {
          category: string;
          name: string;
        };
        return {
          name: metadata.name,
          category: metadata.category ? metadata.category : "",
          content: template.replaceText,
        };
      });

      const sortOrder = updateFormatTemplates.sort(
        (oldTemplate, newTemplate) => {
          // Compare based on the 'type' key
          if (oldTemplate.category === newTemplate.category) {
            // If types are the same, order by the 'value' key
            return oldTemplate["name"].localeCompare(newTemplate["name"]);
          } else {
            // Order 'template' items first
            return oldTemplate.category === "Template" ? -1 : 1;
          }
        }
      );

      new IaraSyncfusionTemplateSearch(sortOrder, this.onTemplateSelected);
    }
  }
}
