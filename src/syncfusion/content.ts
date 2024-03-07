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
  public rtf: string | undefined;
  public pdf: string | undefined;

  constructor(public value: string, private _authHeaders: HeadersInit) {}

  static detectContentType(content: string): IaraSyncfusionContentTypes {
    if (content.startsWith("{\\rtf")) return IaraSyncfusionContentTypes.RTF;
    else if (content.startsWith('{"sfdt":'))
      return IaraSyncfusionContentTypes.SFDT;
    else if (content.startsWith("<")) return IaraSyncfusionContentTypes.HTML;
    else throw new Error("Content type not recognized.");
  }

  static async fromContent(content: string, authHeaders: HeadersInit) {
    const contentType = IaraSFDT.detectContentType(content);
    switch (contentType) {
      case IaraSyncfusionContentTypes.SFDT:
        return new IaraSFDT(content, authHeaders);
      case IaraSyncfusionContentTypes.HTML:
        return IaraSFDT.fromHtml(content, authHeaders);
      case IaraSyncfusionContentTypes.RTF:
        return IaraSFDT.fromRtf(content, authHeaders);
    }
  }

  static async fromEditor(editor: DocumentEditor, authHeaders: HeadersInit) {
    const value: string = await editor
      .saveAsBlob("Sfdt")
      .then((blob: Blob) => blob.text());
    return new IaraSFDT(value, authHeaders);
  }

  static async fromHtml(content: string, authHeaders: HeadersInit) {
    content = content.replaceAll("<br>", "<br/>");
    const response = await fetch(
      "https://api.iarahealth.com/speech/syncfusion/html_to_sfdt/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ html: content }),
      }
    );
    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(responseText);
    }

    return new IaraSFDT(responseText, authHeaders);
  }

  static async fromRtf(content: string, authHeaders: HeadersInit) {
    const response = await fetch(
      "https://api.iarahealth.com/speech/syncfusion/rtf_to_sfdt/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ rtf: content }),
      }
    );
    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(responseText);
    }

    return new IaraSFDT(responseText, authHeaders);
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

  async toHtml(): Promise<string> {
    return this.html
      ? this.html
      : IaraSFDT.toHtml(this.value, this._authHeaders);
  }

  async toRtf(): Promise<string> {
    return this.rtf ? this.rtf : IaraSFDT.toRtf(this.value, this._authHeaders);
  }

  toString(): string {
    return this.value;
  }
}

export class IaraSyncfusionEditorContentManager {
  private _isPlainTextDirty = true;
  private _isSfdtDirty = true;
  private _plainText: string | undefined;
  private _sfdt: IaraSFDT | undefined;

  constructor(
    private _editor: DocumentEditor,
    private _recognition: IaraSpeechRecognition,
    onContentChange: () => void
  ) {
    this._editor.contentChange = () => {
      this._onContentChange();
      onContentChange();
    };
  }

  async getContent(): Promise<[string, string, string, string]> {
    const sfdt = await this._getSfdtContent();
    return Promise.all([
      this.getPlainTextContent(),
      sfdt.toHtml(),
      sfdt.toRtf(),
      sfdt.value,
    ]);
  }

  async getHtmlContent(): Promise<string> {
    const sfdt = await this._getSfdtContent();
    return sfdt.toHtml();
  }

  getPlainTextContent(): Promise<string> {
    return this._getPlainTextContent();
  }

  async getRtfContent(): Promise<string> {
    const sfdt = await this._getSfdtContent();
    return sfdt.toRtf();
  }

  getSfdtContent(): Promise<IaraSFDT> {
    return this._getSfdtContent();
  }

  private async _getSfdtContent(): Promise<IaraSFDT> {
    if (this._isSfdtDirty) {
      this._isSfdtDirty = false;
      this._sfdt = await IaraSFDT.fromEditor(
        this._editor,
        this._recognition.internal.iaraAPIMandatoryHeaders as HeadersInit
      );
    }
    if (!this._sfdt) throw new Error("Invalid SFDT content");

    return this._sfdt;
  }

  private async _getPlainTextContent(): Promise<string> {
    if (this._isPlainTextDirty) {
      this._isPlainTextDirty = false;
      this._plainText = await this._editor
        .saveAsBlob("Txt")
        .then((blob: Blob) => blob.text());
    }
    if (!this._plainText) throw new Error("Invalid plain text content");

    return this._plainText;
  }

  private _onContentChange(): void {
    this._isPlainTextDirty = true;
    this._isSfdtDirty = true;
  }
}
