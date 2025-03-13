import { IaraEditorConfig } from "../editor";

export interface IaraSyncfusionConfig extends IaraEditorConfig {
  assistant: {
    enabled: boolean;
    impression: {
      itemizedOutput: boolean;
    };
    user_rules: { report: string[] };
  };
  mouseButton: boolean;
  replaceToolbar: boolean;
  showBookmarks: boolean;
  showFinishReportButton: boolean;
}
