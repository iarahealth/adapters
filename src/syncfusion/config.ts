import { IaraEditorConfig } from "../editor";

export interface IaraSyncfusionConfig extends IaraEditorConfig {
  assistant: {
    draggable?: {
      containerId: string;
      defaultPosition: { x: number; y: number };
    };
    enabled: boolean;
    impression: {
      itemizedOutput: boolean;
    };
    useUserTemplates: boolean;
    user_rules: { report: string[]; impression: string[] };
  };
  mouseButton: boolean;
  replaceToolbar: boolean;
  showBookmarks: boolean;
  showFinishReportButton: boolean;
}
