import { DocumentEditor } from "@syncfusion/ej2-documenteditor";

import { IaraEditorInferenceFormatter } from "../../editor/formatter";
import { IaraSpeechRecognition } from "../../speech";
import { IaraSyncfusionConfig } from "../config";
import { IaraSyncfusionInferenceBookmarksManager } from "../inferenceBookmarks";
import { IaraSyncfusionNavigationFieldManager } from "../navigationFields";
import { IaraSyncfusionStyleManager } from "../style";
import { IaraSyncfusionContentReadManager } from "./read";
import { IaraSyncfusionContentWriteManager } from "./write";

export class IaraSyncfusionContentManager {
  public reader: IaraSyncfusionContentReadManager;
  public writer: IaraSyncfusionContentWriteManager;

  constructor(
    editor: DocumentEditor,
    inferenceBookmarksManager: IaraSyncfusionInferenceBookmarksManager,
    inferenceFormatter: IaraEditorInferenceFormatter,
    navigationFieldManager: IaraSyncfusionNavigationFieldManager,
    recognition: IaraSpeechRecognition,
    styleManager: IaraSyncfusionStyleManager,
    config: IaraSyncfusionConfig
  ) {
    this.reader = new IaraSyncfusionContentReadManager(editor);
    this.writer = new IaraSyncfusionContentWriteManager(
      editor,
      inferenceBookmarksManager,
      inferenceFormatter,
      navigationFieldManager,
      this.reader,
      recognition,
      styleManager,
      config
    );
  }
}

export * from "./read";
export * from "./write";
