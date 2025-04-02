import { IaraEditorConfig } from "../editor";

export interface IaraSyncfusionConfig extends IaraEditorConfig {
  assistant: {
    enabled: boolean;
    impression: {
      itemizedOutput: boolean;
    };
    draggable: {
      containerId: string;
      defaultPosition: { x: number; y: number };
    };
  };
  mouseButton: boolean;
  replaceToolbar: boolean;
  showBookmarks: boolean;
  showFinishReportButton: boolean;
}
