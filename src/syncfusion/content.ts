import { DocumentEditor, ImageFormat } from "@syncfusion/ej2-documenteditor";
import { IaraSpeechRecognition } from "../speech";
import {
  PdfBitmap,
  PdfDocument,
  PdfPageOrientation,
  PdfPageSettings,
  PdfSection,
  SizeF,
} from "@syncfusion/ej2-pdf-export";
import { IaraSyncfusionConfig } from ".";

export enum IaraSyncfusionContentTypes {
  SFDT = "SFDT",
  HTML = "HTML",
  RTF = "RTF",
}

export class IaraSFDT {
  public html: string | undefined;
  public plainText: string | undefined;
  public rtf: string | undefined;

  constructor(public value: string, private _editor: DocumentEditor) {}

  static detectContentType(content: string): IaraSyncfusionContentTypes {
    if (content.startsWith("{\\rtf")) return IaraSyncfusionContentTypes.RTF;
    else if (content.startsWith('{"sfdt":'))
      return IaraSyncfusionContentTypes.SFDT;
    else if (content.startsWith("<")) return IaraSyncfusionContentTypes.HTML;
    else throw new Error("Content type not recognized.");
  }

  static async fromContent(content: string, editor: DocumentEditor) {
    const contentType = IaraSFDT.detectContentType(content);
    if (contentType === IaraSyncfusionContentTypes.SFDT)
      return new IaraSFDT(content, editor);
    else return IaraSFDT.import(content, editor, contentType);
  }

  static async fromEditor(editor: DocumentEditor) {
    const value: string = await editor
      .saveAsBlob("Sfdt")
      .then((blob: Blob) => blob.text());
    return new IaraSFDT(value, editor);
  }

  static async import(
    content: string,
    editor: DocumentEditor,
    contentType?: IaraSyncfusionContentTypes
  ) {
    if (!contentType) contentType = IaraSFDT.detectContentType(content);
    if (contentType === IaraSyncfusionContentTypes.HTML)
      content = content.replace(/<br>/g, "<br/>");

    const formData = new FormData();
    formData.append(
      "Files",
      new Blob([content], { type: "text/html" }),
      "file.html"
    );

    const response = await fetch(
      "https://syncfusion-document-services-qink2fdpcq-rj.a.run.app/api/documenteditor/Import",
      {
        method: "POST",
        body: formData,
      }
    );
    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(responseText);
    }

    return new IaraSFDT(responseText, editor);
  }

  static async toHtml(content: string): Promise<string> {
    const response = await fetch(
      "https://syncfusion-documenteditor-server-qink2fdpcq-rj.a.run.app/api/documenteditor/ExportSFDT/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Content: content,
          FileName: "file.html",
        }),
      }
    );
    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(responseText);
    }

    const html = responseText.replace(
      `<?xml version="1.0" encoding="utf-8"?>`,
      ""
    );

    return html;
  }

  static async toRtf(content: string): Promise<string> {
    const response = await fetch(
      "https://syncfusion-documenteditor-server-qink2fdpcq-rj.a.run.app/api/documenteditor/ExportSFDT/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Content: content,
          FileName: "file.rtf",
        }),
      }
    );
    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(responseText);
    }

    return responseText;
  }

  static toPdf(content: any, config?: IaraSyncfusionConfig) {
    if (config?.darkMode)
      content.setDefaultCharacterFormat({ fontColor: "#000" });

    const pageTimer = 500;
    const pdfdocument: PdfDocument = new PdfDocument();
    const count: number = content.documentEditor.pageCount;
    let loadedPage = 0;

    const currentDate = new Date();
    const timeZone = currentDate.getTimezoneOffset() / -60;
    currentDate.setHours(currentDate.getHours() + timeZone);
    const dateString = currentDate.toISOString().split("T");
    const timeArray = dateString[1].split(":");
    const timeString = timeArray[0] + "-" + timeArray[1];
    const pdfFileName = "iara-" + dateString[0] + "--" + timeString;

    content.documentEditor.documentEditorSettings.printDevicePixelRatio = 2;

    for (let i = 1; i <= count; i++) {
      setTimeout(() => {
        const format: ImageFormat = "image/jpeg" as ImageFormat;
        // Getting pages as image
        const image = content.documentEditor.exportAsImage(i, format);
        image.onload = function () {
          const imageHeight = parseInt(
            image.style.height.toString().replace("px", "")
          );
          const imageWidth = parseInt(
            image.style.width.toString().replace("px", "")
          );
          const section: PdfSection = pdfdocument.sections.add() as PdfSection;
          const settings: PdfPageSettings = new PdfPageSettings(0);
          if (imageWidth > imageHeight) {
            settings.orientation = PdfPageOrientation.Landscape;
          }
          settings.size = new SizeF(imageWidth, imageHeight);
          (section as PdfSection).setPageSettings(settings);
          const page = section.pages.add();
          const graphics = page.graphics;
          const imageStr = image.src.replace("data:image/jpeg;base64,", "");
          const pdfImage = new PdfBitmap(imageStr);
          graphics.drawImage(pdfImage, 0, 0, imageWidth, imageHeight);
          loadedPage++;
          if (loadedPage == count) {
            // Exporting the document as pdf
            pdfdocument.save(
              (content.documentEditor.documentName === ""
                ? pdfFileName
                : content.documentEditor.documentName) + ".pdf"
            );
          }
        };
      }, pageTimer);
    }

    if (config?.darkMode) {
      setTimeout(() => {
        content.documentEditor.focusIn();
        content.setDefaultCharacterFormat({ fontColor: "#fff" });
      }, count * pageTimer + 200);
    }
  }

  static async editorToPlainText(editor: DocumentEditor): Promise<string> {
    const plainText = await editor
      .saveAsBlob("Txt")
      .then((blob: Blob) => blob.text());
    return plainText;
  }

  async toHtml(): Promise<string> {
    if (!this.html) this.html = await IaraSFDT.toHtml(this.value);
    return this.html;
  }

  async toRtf(): Promise<string> {
    if (!this.rtf) this.rtf = await IaraSFDT.toRtf(this.value);
    return this.rtf;
  }

  async toPlainText(): Promise<string> {
    if (!this.plainText)
      this.plainText = await IaraSFDT.editorToPlainText(this._editor);
    return this.plainText;
  }

  toString(): string {
    return this.value;
  }
}

export class IaraSyncfusionEditorContentManager {
  private _isDirty = true;
  private _sfdt: IaraSFDT | undefined;

  constructor(private _editor: DocumentEditor, onContentChange: () => void) {
    this._editor.contentChange = () => {
      this._onContentChange();
      onContentChange();
    };
  }

  async fromContent(content: string) {
    this._sfdt = await IaraSFDT.fromContent(content, this._editor);
    return this._sfdt;
  }

  async fromEditor() {
    const sfdt = await IaraSFDT.fromEditor(this._editor);
    this._sfdt = sfdt;
    return this._sfdt;
  }

  async getContent(): Promise<[string, string, string, string]> {
    const sfdt = await this._getSfdtContent();
    return Promise.all([
      sfdt.toPlainText(),
      sfdt.toHtml(),
      sfdt.toRtf(),
      sfdt.value,
    ]);
  }

  async getHtmlContent(): Promise<string> {
    const sfdt = await this._getSfdtContent();
    return sfdt.toHtml();
  }

  async getPlainTextContent(): Promise<string> {
    const sfdt = await this._getSfdtContent();
    return sfdt.toPlainText();
  }

  async getRtfContent(): Promise<string> {
    const sfdt = await this._getSfdtContent();
    return sfdt.toRtf();
  }

  getSfdtContent(): Promise<IaraSFDT> {
    return this._getSfdtContent();
  }

  import(content: string, contentType?: IaraSyncfusionContentTypes) {
    return IaraSFDT.import(content, this._editor, contentType);
  }

  private async _getSfdtContent(): Promise<IaraSFDT> {
    if (this._isDirty) {
      this._isDirty = false;
      await this.fromEditor();
    }
    if (!this._sfdt) throw new Error("Invalid SFDT content");
    return this._sfdt;
  }

  private _onContentChange(): void {
    this._isDirty = true;
  }
}
