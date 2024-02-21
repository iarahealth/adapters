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
    // if (theme === "slight") return;
    if (theme === "dark")
    {
      this._editor.documentHelper.backgroundColor = "#444";
      this._editor.setDefaultCharacterFormat({ fontColor: "#fff" });
      return;
    }

    const header = document.getElementsByTagName("head")[0];

    const styleNode = document.createElement("style");
    header.appendChild(styleNode);
    styleNode.sheet?.insertRule(".e-de-background {background-color: #fafafa !important;}");
    styleNode.sheet?.insertRule(".body:not(.is-mobile) ::-webkit-scrollbar  {background-color: inherit !important;}");
    // styleNode.sheet?.insertRule(".e-documenteditor-optionspane {display: block !important;}");
    // styleNode.sheet?.insertRule("body.theme-iara {color: white; background-color: #fafafa !important;}");
    // styleNode.sheet?.insertRule(".e-de-blink-cursor { border-left: 1px solid #fff !important; }");
    // styleNode.sheet?.insertRule(".e-de-status-bar span { color: #fff !important; }");

    // this._editor.documentHelper.backgroundColor = "#fafafa";
    // this._editor.setDefaultCharacterFormat({ fontColor: "#fff" });

    const cssFile = "https://cdn.syncfusion.com/ej2/22.1.34/material3.css";
    const css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    css.setAttribute("id", "light-theme-css");
    css.setAttribute("href", cssFile);
    header.appendChild(css);

    const cssFile2 = "https://cdn.syncfusion.com/ej2/22.1.34/material.css";
    const css2 = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    css.setAttribute("id", "base-ribbon-css");
    css.setAttribute("href", cssFile2);
    header.appendChild(css2);


    const cssFile3 = "https://cdn.jsdelivr.net/npm/@syncfusion/ej2-ribbon@24.2.3/styles/material.min.css";
    const css3 = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    css.setAttribute("id", "light-ribbon-css");
    css.setAttribute("href", cssFile3);
    header.appendChild(css3);

    // @import "@syncfusion/ej2-ribbon/styles/material3-dark.css";

    /* const header = document.getElementsByTagName("head")[0];

    const styleNode = document.createElement("style");
    header.appendChild(styleNode);
    // styleNode.sheet?.insertRule(".e-de-background {background-color: #302D38 !important;}");
    // styleNode.sheet?.insertRule("body.theme-iara {color: white; background-color: #212429 !important;}");
    styleNode.sheet?.insertRule(".e-de-blink-cursor { border-left: 1px solid #fff !important; }");
    styleNode.sheet?.insertRule(".e-de-status-bar span { color: #fff !important; }");

    this._editor.documentHelper.backgroundColor = "#444";
    this._editor.setDefaultCharacterFormat({ fontColor: "#fff" });

    const cssFile = "https://cdn.syncfusion.com/ej2/22.1.34/material3-dark.css";
    const css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    css.setAttribute("id", "dark-theme-css");
    css.setAttribute("href", cssFile);
    header.appendChild(css); */




    // this._editor.documentHelper.backgroundColor = "#444";
    // this._editor.setDefaultCharacterFormat({ fontColor: "#fff" });
    // const FILE = "https://cdn.syncfusion.com/ej2/22.1.34/material3-dark.css";
    // const css = document.createElement("link");
    // css.setAttribute("rel", "stylesheet");
    // css.setAttribute("type", "text/css");
    // css.setAttribute("id", "dark-theme-css");
    // css.setAttribute("href", FILE);
    // document.getElementsByTagName("head")[0].appendChild(css);

    // const styleNode = document.createElement("style");
    // document.getElementsByTagName("head")[0].appendChild(styleNode);
    // styleNode.sheet?.insertRule(".e-de-blink-cursor { border-left: 1px solid #fff !important; }");
    // styleNode.sheet?.insertRule(".e-de-status-bar span { color: #fff !important; }");
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
    this._editor.editor.toggleAllCaps();
  }
}
