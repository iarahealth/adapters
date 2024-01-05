import { DocumentEditor } from "@syncfusion/ej2-documenteditor";
import { IaraSpeechRecognition } from "../speech";

export class IaraSFDT {
  public html: string | undefined;
  public rtf: string | undefined;

  constructor(public value: string, private _authHeaders: HeadersInit) {}

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

  async getContent(): Promise<[string, string, string]> {
    const sfdt = await this._getSfdtContent();
    const plainText = await this.getPlainTextContent();
    return Promise.all([plainText, sfdt.toHtml(), sfdt.toRtf()]);
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
      this._sfdt = await IaraSFDT.fromEditor(
        this._editor,
        this._recognition.internal.iaraAPIMandatoryHeaders as HeadersInit
      );
      this._isSfdtDirty = false;
    }
    if (!this._sfdt) throw new Error("Invalid SFDT content");

    return this._sfdt;
  }

  private async _getPlainTextContent(): Promise<string> {
    if (this._isPlainTextDirty) {
      this._plainText = await this._editor
        .saveAsBlob("Txt")
        .then((blob: Blob) => blob.text());
      this._isPlainTextDirty = false;
    }
    if (!this._plainText) throw new Error("Invalid plain text content");

    return this._plainText;
  }

  private _onContentChange(): void {
    this._isPlainTextDirty = true;
    this._isSfdtDirty = true;
  }
}
