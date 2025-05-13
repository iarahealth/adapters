import { IaraEditorConfig } from "../editor";

export interface IaraSyncfusionConfig extends IaraEditorConfig {
  assistant: {
    enabled: boolean;
    impression: {
      itemizedOutput: boolean;
    };
    draggable?: {
      containerId: string;
      defaultPosition: { x: number; y: number };
    };
    group_rules?: string | string[];
  };
  lineSpacing?: number;
  paragraphSpacing?: {
    after: number;
    before: number;
  };
  mouseButton: boolean;
  replaceToolbar: boolean;
  showBookmarks: boolean;
  showFinishReportButton: boolean;
}
