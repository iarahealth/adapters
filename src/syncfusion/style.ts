import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { IaraSyncfusionConfig } from ".";
import { IaraEditorStyleManager } from "../editor/style";

export class IaraSyncfusionStyleManager extends IaraEditorStyleManager {
  constructor(
    private _editor: DocumentEditor,
    private _config: IaraSyncfusionConfig
  ) {
    super();

    this.setTheme(this._config.darkMode ? "dark" : "light");

    this._editor.setDefaultCharacterFormat({
      fontFamily: this._config.font?.family,
      fontSize: this._config.font?.size,
      fontColor: this._config.darkMode ? "#fff" : "#000",
    });
  }

  setEditorFontColor(color: string): void {
    this._editor.setDefaultCharacterFormat({ fontColor: color });
  }
  setSelectionFontFamily(fontFamily: string): void {
    this._editor.selection.characterFormat.fontFamily = fontFamily;
    this._editor.focusIn();
  }
  setSelectionFontSize(fontSize: number): void {
    this._editor.selection.characterFormat.fontSize = fontSize;
    this._editor.focusIn();
  }

  setTheme(theme: "light" | "dark") {
    if (theme === "light") return;

    IaraSyncfusionStyleManager.loadThemeCss(theme);
    this._editor.documentHelper.backgroundColor = "#444";
    this._editor.setDefaultCharacterFormat({ fontColor: "#fff" });
  }

  static loadThemeCss(theme: "light" | "dark") {
    if (theme === "dark") {
      const FILE = "https://cdn.syncfusion.com/ej2/24.2.9/material3-dark.css";
      const css = document.createElement("link");
      css.setAttribute("rel", "stylesheet");
      css.setAttribute("type", "text/css");
      css.setAttribute("id", "dark-theme-css");
      css.setAttribute("href", FILE);
      document.getElementsByTagName("head")[0].appendChild(css);

      const styleNode = document.createElement("style");
      document.getElementsByTagName("head")[0].appendChild(styleNode);
      styleNode.sheet?.insertRule(
        ".e-de-blink-cursor { border-left: 1px solid #fff !important; }"
      );
      styleNode.sheet?.insertRule(
        ".e-de-status-bar span { color: #fff !important; }"
      );
    }
  }

  toggleBold(): void {
    this._editor.editor.toggleBold();
  }
  toggleItalic(): void {
    this._editor.editor.toggleItalic();
  }
  toggleUnderline(): void {
    this._editor.editor.toggleUnderline("Single");
  }
  toggleUppercase(): void {
    // this._editor.editor.toggleAllCaps();
    !this._editor.selection.characterFormat.allCaps
      ? this._editor.editor.changeCase("Uppercase")
      : this._editor.editor.changeCase("Lowercase");
  }
}
