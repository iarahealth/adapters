import { DocumentEditorContainer, DocumentEditorKeyDownEventArgs } from "@syncfusion/ej2-documenteditor";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionTemplateSearch } from "./templateSearch";

export class IaraSyncfusionShortcutsManager {
  constructor(private _editor: DocumentEditorContainer, private _recognition: IaraSpeechRecognition) {
    this._editor.documentEditor.keyDown = this.onKeyDown.bind(this); 
  }
  onKeyDown(args: DocumentEditorKeyDownEventArgs){
    const key: string = args.event.key;
    const isShiftKey: boolean =
      args.event.shiftKey || args.event.metaKey
        ? true
        : key === "Shift"
        ? true
        : false;

    if (isShiftKey && key === "@") {
      console.log(this._recognition.richTranscriptTemplates, "RECOGN")
      
      new IaraSyncfusionTemplateSearch(this.updatePhrasesAndTemplates())
    }
  };
  updatePhrasesAndTemplates() {
    const phraseAndTemplate = [
      {
        name: "discopatia",
        id: "1",
        category: "Templates",
      },
      {
        name: "exame",
        id: "2",
        category: "Frases",
      },
      {
        name: "tomografia",
        id: "4",
        category: "Templates",
      },
      {
        name: "exame",
        id: "5",
        category: "Templates",
      },
      {
        name: "tomografia",
        id: "6",
        category: "Frases",
      },
      {
        name: "tomografia computadorizada",
        id: "7",
        category: "Templates",
      },
      {
        name: "nodulo",
        id: "8",
        category: "Frases",
      },
      {
        name: "radiologia",
        id: "9",
        category: "Templates",
      },
    ];
    return phraseAndTemplate;
  }
}