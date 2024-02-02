import { DocumentEditor, ImageFormat } from "@syncfusion/ej2-documenteditor";
import { IaraSpeechRecognition } from "../speech";
import {
  PdfBitmap,
  PdfDocument,
  PdfPageOrientation,
  PdfPageSettings,
  PdfSection,
  SizeF,
} from '@syncfusion/ej2-pdf-export';
import { IaraSyncfusionConfig } from ".";

export enum IaraSyncfusionContentTypes {
  SFDT = "SFDT",
  HTML = "HTML",
  RTF = "RTF",
  PDF = "PDF",
}

export class IaraSFDT {
  public html: string | undefined;
  public rtf: string | undefined;
  public pdf: string | undefined;

  constructor(public value: string, private _authHeaders: HeadersInit) {}

  static detectContentType(content: string): IaraSyncfusionContentTypes {
    if (content.startsWith("{\\rtf")) return IaraSyncfusionContentTypes.RTF;
    else if (content.startsWith("{")) return IaraSyncfusionContentTypes.SFDT;
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
    const sfdt = await fetch(
      "https://api.iarahealth.com/speech/syncfusion/html_to_sfdt/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ html: content }),
      }
    ).then(response => response.text());

    return new IaraSFDT(sfdt, authHeaders);
  }

  static async fromRtf(content: string, authHeaders: HeadersInit) {
    const sfdt = await fetch(
      "https://api.iarahealth.com/speech/syncfusion/rtf_to_sfdt/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ rtf: content }),
      }
    ).then(response => response.text());

    return new IaraSFDT(sfdt, authHeaders);
  }

  static async toHtml(
    content: string,
    authHeaders: HeadersInit
  ): Promise<string> {
    const { html } = await fetch(
      "https://api.iarahealth.com/speech/syncfusion/sfdt_to_html/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: content,
      }
    ).then(response => response.json());

    return html;
  }

  static async toRtf(
    content: string,
    authHeaders: HeadersInit
  ): Promise<string> {
    const { rtf } = await fetch(
      "https://api.iarahealth.com/speech/syncfusion/sfdt_to_rtf/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: content,
      }
    ).then(response => response.json());
    return rtf;
  }

  static toPdf(content: any, config?: IaraSyncfusionConfig)
  {
    if (config?.darkMode) content.setDefaultCharacterFormat({ fontColor: '#000' });

    let pageTimer = 500;
    let pdfdocument: PdfDocument = new PdfDocument();
    let count: number = content.documentEditor.pageCount;
    let loadedPage = 0;
    content.documentEditor.selection.select("0;0;0", "0;0;200");
    let docTitle = content.documentEditor.selection.text;
    let pdfFileName = 'iara-' + (new Date()).toISOString().split('T')[0] + '--' + docTitle;
    content.documentEditor.documentEditorSettings.printDevicePixelRatio = 2;

    for (let i = 1; i <= count; i++)
    {
      setTimeout(() => {
          let format: ImageFormat = 'image/jpeg' as ImageFormat;
          // Getting pages as image
          let image = content.documentEditor.exportAsImage(i, format);
          image.onload = function () {
              let imageHeight = parseInt(
                  image.style.height.toString().replace('px', '')
              );
              let imageWidth = parseInt(
                  image.style.width.toString().replace('px', '')
              );
              let section: PdfSection = pdfdocument.sections.add() as PdfSection;
              let settings: PdfPageSettings = new PdfPageSettings(0);
              if (imageWidth > imageHeight) {
                  settings.orientation = PdfPageOrientation.Landscape;
              }
              settings.size = new SizeF(imageWidth, imageHeight);
              (section as PdfSection).setPageSettings(settings);
              let page = section.pages.add();
              let graphics = page.graphics;
              let imageStr = image.src.replace('data:image/jpeg;base64,', '');
              let pdfImage = new PdfBitmap(imageStr);
              graphics.drawImage(pdfImage, 0, 0, imageWidth, imageHeight);
              loadedPage++;
              if (loadedPage == count) {
                  // Exporting the document as pdf
                  pdfdocument.save(
                      (content.documentEditor.documentName === ''
                          ? pdfFileName
                          : content.documentEditor.documentName) + '.pdf'
                  );
              }
          };
      }, pageTimer);
    }

    if (config?.darkMode)
    {
      setTimeout(() => {
          content.documentEditor.focusIn();
          content.setDefaultCharacterFormat({ fontColor: '#fff' });
      }, ((count * pageTimer) + 200));
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
