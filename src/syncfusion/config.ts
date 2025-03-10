import { IaraEditorConfig } from "../editor";

export interface IaraSyncfusionConfig extends IaraEditorConfig {
  assistant: {
    enabled: boolean;
    impression: {
      itemizedOutput: boolean;
    };
    containerId: string;
    defaultPosition: { x: number; y: number };
    isDraggable: boolean;
  };
  mouseButton: boolean;
  replaceToolbar: boolean;
  showBookmarks: boolean;
  showFinishReportButton: boolean;
}
