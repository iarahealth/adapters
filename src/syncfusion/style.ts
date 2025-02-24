import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { IaraSyncfusionConfig } from ".";
import { IaraEditorStyleManager } from "../editor/style";

interface Font {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
}

export class IaraSyncfusionStyleManager extends IaraEditorStyleManager {
  public zoomInterval: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private _editor: DocumentEditor,
    private _config: IaraSyncfusionConfig
  ) {
    super();

    const styleNode = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(styleNode);
    styleNode.sheet?.insertRule(
      `.e-iara-logo {
        background-image: url("https://app.iarahealth.com/static/angular/assets/images/logos/logo-simple.png") !important;
        height: 24px !important;
        margin-top: 6px !important;
        width: 24px !important;
      }`
    );

    this.setTheme(this._config.darkMode ? "dark" : "light");
    this.setEditorDefaultFont();
    this.setZoomFactor(this._config.zoomFactor ?? "100%");
  }

  setEditorDefaultFont(
    font: Font = {
      fontFamily: this._config.font?.family || "Times New Roman",
      fontSize: this._config.font?.size || 12,
      fontColor: this._config.darkMode ? "#fff" : "#000",
    }
  ): void {
    this._editor.setDefaultCharacterFormat(font);

    // For each of the syncfusion pre-defined styles, set the font family and size
    const styles = this._editor.documentHelper.preDefinedStyles.values.map(
      style => {
        return {
          ...JSON.parse(style),
          characterFormat: font,
        };
      }
    );
    styles.forEach(style => {
      this._editor.editor.createStyle(JSON.stringify(style), true);
    });

    this._editor.documentHelper.getAuthorColor = (author: string) => {
      if (this._editor.documentHelper.authors.containsKey(author)) {
        return this._editor.documentHelper.authors.get(author);
      }
      let color: string;
      (color = this._config.darkMode ? "#f2b8b5" : "#b5082e"),
        this._editor.documentHelper.authors.add(author, color);
      return color;
    };
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

  public setZoomFactor(zoomFactor: string) {
    if (zoomFactor.match("Fit one page")) {
      this._editor.fitPage("FitOnePage");
    } else if (zoomFactor.match("Fit page width")) {
      this._editor.fitPage("FitPageWidth");
    } else {
      const zoomFactorFixed = parseInt(zoomFactor, 0) / 100;
      this._editor.zoomFactor = Number(zoomFactorFixed);
    }

    if (this.zoomInterval) clearInterval(this.zoomInterval);
  }

  static loadThemeCss(theme: "light" | "dark") {
    if (theme === "dark") {
      const FILE = "https://cdn.syncfusion.com/ej2/26.2.11/material3-dark.css";
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
    this._editor.selection.characterFormat.bold =
      !this._editor.selection.characterFormat.bold;
  }
  toggleItalic(): void {
    this._editor.selection.characterFormat.italic =
      !this._editor.selection.characterFormat.italic;
  }
  toggleList(): void {
    if (this._editor.selection.paragraphFormat.listText === undefined) {
      this._editor.editor.applyBullet("\uf0b7", "Symbol");
    } else {
      if (this._editor.selection.paragraphFormat.listText.length) {
        this._editor.editor.insertText("\n");
      }
      this._editor.editor.clearList();
    }
  }
  toggleNumberedList(): void {
    if (this._editor.selection.paragraphFormat.listText === undefined) {
      this._editor.editor.applyNumbering("%1)");
    } else {
      if (this._editor.selection.paragraphFormat.listText.length) {
        this._editor.editor.insertText("\n");
      }
      this._editor.editor.clearList();
    }
  }
  toggleUnderline(): void {
    if (this._editor.selection.characterFormat.underline === "Single") {
      this._editor.selection.characterFormat.underline = "None";
    } else {
      this._editor.selection.characterFormat.underline = "Single";
    }
  }
  toggleUppercase(): void {
    this._editor.selection.characterFormat.allCaps =
      !this._editor.selection.characterFormat.allCaps;
  }
}
