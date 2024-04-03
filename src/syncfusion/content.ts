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

  constructor(
    public value: string,
    private _editor: DocumentEditor,
    private _authHeaders: HeadersInit
  ) {}

  static detectContentType(content: string): IaraSyncfusionContentTypes {
    if (content.startsWith("{\\rtf")) return IaraSyncfusionContentTypes.RTF;
    else if (content.startsWith('{"sfdt":'))
      return IaraSyncfusionContentTypes.SFDT;
    else if (content.startsWith("<")) return IaraSyncfusionContentTypes.HTML;
    else throw new Error("Content type not recognized.");
  }

  static async fromContent(
    content: string,
    editor: DocumentEditor,
    authHeaders: HeadersInit
  ) {
    const contentType = IaraSFDT.detectContentType(content);
    if (contentType === IaraSyncfusionContentTypes.SFDT)
      return new IaraSFDT(content, editor, authHeaders);
    else return IaraSFDT.import(content, editor, authHeaders, contentType);
  }

  static async fromEditor(editor: DocumentEditor, authHeaders: HeadersInit) {
    const value: string = await editor
      .saveAsBlob("Sfdt")
      .then((blob: Blob) => blob.text());
    return new IaraSFDT(value, editor, authHeaders);
  }

  static async import(
    content: string,
    editor: DocumentEditor,
    authHeaders: HeadersInit,
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
      "https://ej2services.syncfusion.com/production/web-services/api/documenteditor/Import",
      {
        method: "POST",
        body: formData,
      }
    );
    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(responseText);
    }

    return new IaraSFDT(responseText, editor, authHeaders);
  }

  static async toHtml(
    content: string,
    authHeaders: HeadersInit
  ): Promise<string> {
    const response = await fetch(
      "https://api.iarahealth.com/speech/syncfusion/sfdt_to_html/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: content,
      }
    );
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson);
    }

    let { html } = responseJson;
    html = responseJson.html.replace(
      `<?xml version="1.0" encoding="utf-8"?>`,
      ""
    );

    return html;
  }

  static async toRtf(
    content: string,
    authHeaders: HeadersInit
  ): Promise<string> {
    const response = await fetch(
      "https://api.iarahealth.com/speech/syncfusion/sfdt_to_rtf/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: content,
      }
    );
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson);
    }

    const { rtf } = responseJson;
    return rtf;
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
    if (!this.html)
      this.html = await IaraSFDT.toHtml(this.value, this._authHeaders);
    return this.html;
  }

  async toRtf(): Promise<string> {
    if (!this.rtf)
      this.rtf = await IaraSFDT.toRtf(this.value, this._authHeaders);
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
  private _authHeaders: HeadersInit;
  private _isDirty = true;
  private _sfdt: IaraSFDT | undefined;

  constructor(
    private _editor: DocumentEditor,
    recognition: IaraSpeechRecognition,
    onContentChange: () => void
  ) {
    this._authHeaders = recognition.internal
      .iaraAPIMandatoryHeaders as HeadersInit;
    this._editor.contentChange = () => {
      this._onContentChange();
      onContentChange();
    };
  }

  async fromContent(content: string) {
    this._sfdt = await IaraSFDT.fromContent(
      content,
      this._editor,
      this._authHeaders
    );
    return this._sfdt;
  }

  async fromEditor() {
    const sfdt = await IaraSFDT.fromEditor(this._editor, this._authHeaders);
    console.log("fromEditor", sfdt.value);
    this._sfdt = sfdt;
    return this._sfdt;
  }

  async getContent(): Promise<[string, string, string, string]> {
    console.log("getContent");
    const sfdt = await this._getSfdtContent();
    return Promise.all([
      sfdt.toPlainText(),
      sfdt.toHtml(),
      sfdt.toRtf(),
      sfdt.value,
    ]);
  }

  async getHtmlContent(): Promise<string> {
    console.log("getHtmlContent");
    const sfdt = await this._getSfdtContent();
    return sfdt.toHtml();
  }

  async getPlainTextContent(): Promise<string> {
    console.log("getPlainTextContent");
    const sfdt = await this._getSfdtContent();
    return sfdt.toPlainText();
  }

  async getRtfContent(): Promise<string> {
    console.log("getRtfContent");
    const sfdt = await this._getSfdtContent();
    return sfdt.toRtf();
  }

  getSfdtContent(): Promise<IaraSFDT> {
    console.log("getSfdtContent");
    return this._getSfdtContent();
  }

  import(content: string, contentType?: IaraSyncfusionContentTypes) {
    return IaraSFDT.import(
      content,
      this._editor,
      this._authHeaders,
      contentType
    );
  }

  private async _getSfdtContent(): Promise<IaraSFDT> {
    console.log("get sfdt");
    if (this._isDirty) {
      console.log("get new sfdt content!");
      this._isDirty = false;
      this.fromEditor();
    }
    if (!this._sfdt) throw new Error("Invalid SFDT content");
    return this._sfdt;
  }

  private _onContentChange(): void {
    this._isDirty = true;
  }
}
