import {
  DocumentEditorContainer,
  DocumentEditorKeyDownEventArgs,
} from "@syncfusion/ej2-documenteditor";
import { ListView } from "@syncfusion/ej2-lists";
import { Dialog } from "@syncfusion/ej2-popups";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionTemplateSearch } from "./templateSearch";

export class IaraSyncfusionShortcutsManager {
  constructor(
    private _editor: DocumentEditorContainer,
    private _recognition: IaraSpeechRecognition,
    private onTemplateSelected: (
      listViewInstance: ListView,
      dialogObj: Dialog
    ) => void
  ) {
    this._editor.documentEditor.keyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const key: string = args.event.key;
    const isShiftKey: boolean =
      args.event.shiftKey || args.event.metaKey
        ? true
        : key === "Shift"
        ? true
        : false;

    if (isShiftKey && key === "@") {
      const templates = [
        ...Object.values(this._recognition.richTranscriptTemplates.templates),
      ];
      const updateFormatTemplates = templates.map(template => {
        const categoryName = template.metadata as { category: string };
        return {
          name: template.key,
          category: categoryName.category ? categoryName.category : "",
          content: template.replaceText,
        };
      });

      new IaraSyncfusionTemplateSearch(
        updateFormatTemplates,
        this.onTemplateSelected
      );
    }
  }
}
