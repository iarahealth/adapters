import {
  CharacterFormatProperties,
  DocumentEditor,
  DocumentEditorContainer,
  Print,
} from "@syncfusion/ej2-documenteditor";
import { ListView, SelectedCollection } from "@syncfusion/ej2-lists";
import {
  Dialog,
  createSpinner,
  hideSpinner,
  showSpinner,
} from "@syncfusion/ej2-popups";
import debounce from "debounce";
import { EditorAdapter } from "../editor";
import { IaraSpeechRecognition, IaraSpeechRecognitionDetail } from "../speech";
import { IaraSyncfusionAIAssistantManager } from "./assistant";
import { IaraSyncfusionConfig } from "./config";
import { IaraSFDT, IaraSyncfusionContentManager } from "./content";
import { IaraSyncfusionContextMenuManager } from "./contextMenu";
import { IaraSyncfusionFooterBarManager } from "./footerBar";
import {
  IaraInferenceBookmark,
  IaraSyncfusionInferenceBookmarksManager,
} from "./inferenceBookmarks";
import { IaraSyncfusionLanguageManager } from "./language";
import { IaraSyncfusionNavigationFieldManager } from "./navigationFields/index";
import { IaraSyncfusionShortcutsManager } from "./shortcuts";
import { IaraSyncfusionStyleManager } from "./style";
import { IaraSyncfusionToolbarManager } from "./toolbar";

interface ClipboardItem {
  readonly types: ReadonlyArray<string>;
  getType(type: string): Promise<Blob>;
}

declare let ClipboardItem: {
  prototype: ClipboardItem;
  new (
    items: Record<string, string | Blob | PromiseLike<string | Blob>>,
    options?: any
  ): ClipboardItem;
};

declare global {
  interface Clipboard extends EventTarget {
    read(): Promise<ClipboardItem[]>;
    readText(): Promise<string>;
    write(data: ClipboardItem[]): Promise<void>;
    writeText(data: string): Promise<void>;
  }
}

export class IaraSyncfusionAdapter
  extends EditorAdapter
  implements EditorAdapter
{
  public static IARA_API_URL = "https://api.iarahealth.com/";
  private readonly _assistantManager?: IaraSyncfusionAIAssistantManager;
  private readonly _contentManager: IaraSyncfusionContentManager;
  private _contentDate?: Date;
  private _currentTemplatePlainText?: string;
  private _currentAssistantGeneratedReport?: Record<string, unknown>;
  private _cursorSelection?: { startOffset: string; endOffset: string };
  private readonly _debouncedSaveReport: () => void;
  private readonly _documentEditor: DocumentEditor;
  private readonly _editorContainer?: DocumentEditorContainer;
  private readonly _toolbarManager?: IaraSyncfusionToolbarManager;
  private readonly _languageManager: IaraSyncfusionLanguageManager;
  private readonly _inferenceBookmarksManager: IaraSyncfusionInferenceBookmarksManager;
  private readonly _footerBarManager: IaraSyncfusionFooterBarManager;
  private readonly _listeners: {
    key: string;
    callback: (event?: Event) => void;
  }[] = [];

  protected _navigationFieldManager: IaraSyncfusionNavigationFieldManager;
  protected static DefaultConfig: IaraSyncfusionConfig = {
    ...EditorAdapter.DefaultConfig,
    assistant: {
      enabled: true,
      impression: {
        itemizedOutput: true,
      },
    },
    replaceToolbar: false,
    showBookmarks: false,
    showFinishReportButton: true,
  };
  protected _styleManager: IaraSyncfusionStyleManager;

  public defaultFormat: CharacterFormatProperties = {};
  public get contentManager(): IaraSyncfusionContentManager {
    return this._contentManager;
  }
  public get documentEditor(): DocumentEditor {
    return this._documentEditor;
  }
  public set preprocessAndInsertTemplate(
    func: (template: unknown, metadata: unknown) => Promise<void>
  ) {
    this._contentManager.writer.preprocessAndInsertTemplate = func;
  }

  constructor(
    _editorInstance: DocumentEditorContainer | DocumentEditor,
    protected _recognition: IaraSpeechRecognition,
    public config: IaraSyncfusionConfig = IaraSyncfusionAdapter.DefaultConfig
  ) {
    super(_recognition, config);

    IaraSyncfusionAdapter.IARA_API_URL =
      this._recognition.internal.initParams.region === "europe"
        ? "https://api.iarahealth.eu/"
        : "https://api.iarahealth.com/";
    IaraSFDT.IARA_API_URL = IaraSyncfusionAdapter.IARA_API_URL;

    if ("documentEditor" in _editorInstance) {
      this._editorContainer = _editorInstance;
      this._documentEditor = _editorInstance.documentEditor;
      this._editorContainer.documentEditorSettings.showBookmarks =
        this.config.showBookmarks;
    } else {
      this._documentEditor = _editorInstance;
    }

    this._languageManager = new IaraSyncfusionLanguageManager(this.config);

    this._debouncedSaveReport = debounce(this._saveReport.bind(this), 1000);
    const saveReportCallback = () =>
      this.config.saveReport ? this._debouncedSaveReport() : undefined;
    this._listeners.push({
      key: "IaraSyncfusionContentChange",
      callback: saveReportCallback,
    });

    this._styleManager = new IaraSyncfusionStyleManager(
      this._documentEditor,
      this.config
    );

    this._navigationFieldManager = new IaraSyncfusionNavigationFieldManager(
      this._documentEditor,
      this.config,
      this._recognition,
      this._languageManager
    );

    this._inferenceBookmarksManager =
      new IaraSyncfusionInferenceBookmarksManager(
        this._documentEditor,
        this._recognition
      );

    if (this.config.replaceToolbar && this._editorContainer) {
      this._toolbarManager = new IaraSyncfusionToolbarManager(
        this._editorContainer,
        this.config,
        this._navigationFieldManager,
        this._languageManager
      );
      this._toolbarManager.init();
    }

    this._footerBarManager = new IaraSyncfusionFooterBarManager(
      this._languageManager,
      this.config,
      this.finishReport.bind(this)
    );

    this._contentManager = new IaraSyncfusionContentManager(
      this._documentEditor,
      this._inferenceBookmarksManager,
      this._inferenceFormatter,
      this._navigationFieldManager,
      this._recognition,
      this._styleManager,
      this.config
    );

    if (this.config.assistant.enabled) {
      this._assistantManager = new IaraSyncfusionAIAssistantManager(
        this._documentEditor,
        this._recognition,
        this._contentManager,
        this.config
      );
    }

    this._listeners.push({
      key: "IaraAssistantReport",
      callback: (event?: Event) => {
        if (!event) return;
        this._currentAssistantGeneratedReport = (
          event as CustomEvent<{
            report: string;
            input: Record<string, unknown>;
          }>
        ).detail;
      },
    });

    this._listeners.forEach(({ key, callback }) => {
      addEventListener(key, callback);
    });

    DocumentEditor.Inject(Print);

    this._documentEditor.enablePrint = true;
    this._documentEditor.enableImageResizer = true;

    this._documentEditor.addEventListener("destroyed", () => {
      if (saveReportCallback)
        removeEventListener("IaraSyncfusionContentChange", saveReportCallback);
      this._onEditorDestroyed();
      this._assistantManager?.destroy();
      this._inferenceBookmarksManager.destroy();
      this._navigationFieldManager.destroy();
      this._toolbarManager?.destroy();
      this._listeners.forEach(({ key, callback }) => {
        removeEventListener(key, callback);
      });
    });

    new IaraSyncfusionShortcutsManager(
      this._documentEditor,
      _recognition,
      this._contentManager,
      this.config,
      this._navigationFieldManager,
      this.onTemplateSelectedAtShortCut.bind(this)
    );

    new IaraSyncfusionContextMenuManager(
      this._documentEditor,
      this._navigationFieldManager,
      this._languageManager
    );

    createSpinner({
      target: this._documentEditor.editor.documentHelper.viewerContainer,
    });

    this._setScrollClickHandler();

    const defaultOnCopy = this._documentEditor.selection.onCopy.bind(
      this._documentEditor.selection
    );
    this._documentEditor.selection.onCopy = async (event: ClipboardEvent) => {
      this._documentEditor.selection["htmlContent"] =
        this._preprocessClipboardHtml(
          this._documentEditor.selection["htmlContent"]
        );
      defaultOnCopy(event);
    };

    const selectionChangeCallback = () => {
      dispatchEvent(new CustomEvent("SyncfusionOnSelectionChange"));
    };

    this._documentEditor.selectionChange = debounce(
      selectionChangeCallback,
      100
    );
  }

  blockEditorWhileSpeaking(status: boolean): void {
    const wrapper = document.getElementById("iara-syncfusion-editor-container");
    if (wrapper) wrapper.style.cursor = status ? "not-allowed" : "auto";
  }

  protected _handleRemovedNavigationField(): void {
    const { content, title, type } = this._contentManager.writer.selectedField;
    if (this._contentManager.writer.selectedField.content)
      this._navigationFieldManager.insertField(content, title, type);
  }

  private _wrapElementWithLegacyStyles(element: HTMLElement): void {
    element.innerHTML = element.innerHTML.replace(/^( )+$/giu, "&nbsp;");

    // Wrap paragraph and span tags in strong, em, u, and s tags if style properties are set to support older editors (tiny v3)ß
    if (element.style.fontWeight === "bold") {
      element.innerHTML = `<strong><b>${element.innerHTML}</b></strong>`;
      element.style.fontWeight = "";
    }
    if (element.style.fontStyle === "italic") {
      element.innerHTML = `<em><i>${element.innerHTML}</i></em>`;
      element.style.fontStyle = "";
    }
    if (element.style.textDecoration === "underline") {
      element.innerHTML = `<u>${element.innerHTML}</u>`;
      element.style.textDecoration = "";
    }
    if (element.style.textDecoration === "line-through") {
      element.innerHTML = `<s>${element.innerHTML}</s>`;
      element.style.textDecoration = "";
    }
  }

  private _preprocessClipboardHtml(html: string): string {
    const document = new DOMParser().parseFromString(html, "text/html");

    const paragraphs = [
      ...(document.getElementsByTagName(
        "p"
      ) as unknown as HTMLParagraphElement[]),
    ];
    paragraphs.forEach(paragraph => {
      // Allow breaking long lines
      paragraph.style.whiteSpace = "normal";
      this._wrapElementWithLegacyStyles(paragraph);
    });

    const spans = [
      ...(document.getElementsByTagName(
        "span"
      ) as unknown as HTMLSpanElement[]),
    ];
    spans.forEach(span => this._wrapElementWithLegacyStyles(span));

    html = document.documentElement.innerHTML;

    // Some needed processing for the clipboard html:
    // 1. Remove the meta tag that comes from the clipboard, it will be readded automatically.
    // 2. Remove any `a` tags from the html, as they may be incorrectly handled as links on the
    //    target editor. These tags are added by our bookmarks, and can be safely removed.
    // 3. Replace empty paragraphs for a simpler paragraph with a line break
    html = html
      .replace(/<(meta|a) [^>]+>/giu, "")
      .replace(/<\/a>/giu, "")
      .replace(
        /(<p [^>]+>)<span( [^>]+)?>\s*<\/span>(<\/p>)/giu,
        "$1&nbsp;</p>"
      );

    return html;
  }

  async copyReport(): Promise<string[]> {
    this.showSpinner();
    if (this._navigationFieldManager.bookmarks.length)
      this._navigationFieldManager.clearReportToCopyContent();

    this._documentEditor.revisions.acceptAll();
    this._documentEditor.enableTrackChanges = false;

    const { startOffset, endOffset } = this._documentEditor.selection;
    this._documentEditor.selection.selectAll();

    try {
      const content = await this._contentManager.reader.getContent();
      const htmlContent = this._preprocessClipboardHtml(
        this._documentEditor.selection.getHtmlContent() || content[1]
      );

      this._recognition.automation.copyText(
        content[0],
        htmlContent,
        content[2]
      );
      this._documentEditor.selection.moveNextPosition();

      return content.slice(0, 3);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      this._documentEditor.selection.select(startOffset, endOffset);
      this.hideSpinner();
    }
  }

  clearReport(): void {
    this._contentManager.writer.clear();
    this._currentTemplatePlainText = undefined;
  }

  getEditorContent(): Promise<[string, string, string, string]> {
    return this._contentManager.reader.getContent();
  }

  insertText(text: string): void {
    this._contentManager.writer.insertText(text);
  }

  insertInferenceText(text: string): void {
    this._contentManager.writer.insertInferenceText(text);
  }

  insertParagraph(): void {
    this._contentManager.writer.insertParagraph();
  }

  async insertTemplate(
    content: string,
    replaceAllContent = false
  ): Promise<void> {
    await this._contentManager.writer.insertTemplate(
      content,
      replaceAllContent
    );
    this._currentTemplatePlainText =
      await this._contentManager.reader.getPlainTextContent();
  }

  async finishReport(): Promise<string[]> {
    this._inferenceBookmarksManager.updateBookmarks();

    Object.values(this._inferenceBookmarksManager.bookmarks).forEach(
      async (bookmark: IaraInferenceBookmark) => {
        const normalizedContent = bookmark.content
          .replace(/\r/g, "\n")
          .trim()
          .toLocaleLowerCase();
        const normalizedInferenceText = bookmark.inferenceText
          ?.trim()
          .toLocaleLowerCase();
        if (
          !bookmark.recordingId ||
          !normalizedContent.length ||
          !normalizedInferenceText?.length
        )
          return;

        const evaluation =
          normalizedContent === normalizedInferenceText ? 6 : 5;
        await fetch(`${IaraSyncfusionAdapter.IARA_API_URL}voice/validation/`, {
          headers: {
            ...this._recognition.internal.iaraAPIMandatoryHeaders,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            evaluation, // editor-made validation as documented
            recording_id: bookmark.recordingId,
            corrected_text: bookmark.content.replace("\\r", "\\n"),
          }),
        });
      }
    );
    const content = await super.finishReport({
      template: this._currentTemplatePlainText,
      transcriptions: Object.values(this._inferenceBookmarksManager.bookmarks),
      generatedReport: this._currentAssistantGeneratedReport,
    });

    this._currentAssistantGeneratedReport = undefined;
    this._currentTemplatePlainText = undefined;
    this._inferenceBookmarksManager.clearBookmarks();

    dispatchEvent(new CustomEvent("IaraOnFinishReport", { detail: content }));
    return content;
  }

  hideSpinner(): void {
    hideSpinner(this._documentEditor.editor.documentHelper.viewerContainer);
  }

  insertInference(inference: IaraSpeechRecognitionDetail): void {
    this._contentManager.writer.insertInference(inference);
  }

  moveToDocumentEnd() {
    this._documentEditor.selection.moveToDocumentEnd();
  }

  undo(): void {
    this._documentEditor.editorHistory.undo();
  }

  private async _saveReport(): Promise<void> {
    if (this._documentEditor.isDocumentEmpty) return;
    this._footerBarManager.updateSavingReportStatus("loading");
    if (!this._recognition.report["_key"]) await this._beginReport();

    try {
      const contentDate = new Date();
      this._contentDate = contentDate;

      const content: string[] = await this._contentManager.reader.getContent();

      if (contentDate !== this._contentDate) return;

      await this._updateReport(content[0], content[1]);
      this._footerBarManager.updateSavingReportStatus("success");
      dispatchEvent(new CustomEvent("IaraOnSaveReport", { detail: content }));
    } catch {
      this._footerBarManager.updateSavingReportStatus("error");
    }
  }

  onTemplateSelectedAtShortCut(
    listViewInstance: ListView,
    dialogObj: Dialog
  ): void {
    ["click", "keyup"].forEach(event => {
      document.getElementById("listview")?.addEventListener(event, e => {
        const click = e as PointerEvent;
        const keyup = e as KeyboardEvent;
        if (keyup.key === "Enter" || click.pointerType === "mouse") {
          const selecteditem: SelectedCollection =
            listViewInstance.getSelectedItems() as SelectedCollection;
          const item = selecteditem.data as unknown as {
            name: string;
            category: string;
            content: string;
            id: number;
          };

          if (item.category === "Template") {
            if (this._contentManager.writer.preprocessAndInsertTemplate)
              this._contentManager.writer.preprocessAndInsertTemplate?.(
                item.content,
                item
              );
            else
              this._contentManager.writer.insertTemplate(item.content, false);
          } else this._contentManager.writer.insertText(item.content);

          dialogObj.hide();
        }
      });
    });
  }

  print(): void {
    if (this.config.darkMode) this._styleManager.setEditorFontColor("#000");
    this._documentEditor.print();
    if (this.config.darkMode) this._styleManager.setEditorFontColor("#fff");
  }

  replaceParagraph(
    sectionIndex: number,
    paragraphIndex: number,
    content: string
  ) {
    this._documentEditor.selection.select(
      `${sectionIndex};${paragraphIndex};0`,
      `${sectionIndex};${paragraphIndex};0`
    );

    this._documentEditor.selection.extendToParagraphEnd();
    this._contentManager.writer.insertText(content);
  }

  showSpinner(): void {
    showSpinner(this._documentEditor.editor.documentHelper.viewerContainer);
  }

  private _setScrollClickHandler() {
    this._documentEditor
      .getRootElement()
      .addEventListener("mousedown", event => {
        if (event.button === 1) {
          this._cursorSelection = {
            startOffset: this._documentEditor.selection.startOffset,
            endOffset: this._documentEditor.selection.endOffset,
          };
        }
      });

    this._documentEditor.getRootElement().addEventListener("mouseup", event => {
      if (
        event.button === 1 &&
        this._cursorSelection &&
        this.config.mouseButton
      ) {
        this._documentEditor.selection.select(
          this._cursorSelection.startOffset,
          this._cursorSelection.endOffset
        );
        this._cursorSelection = undefined;
        this._recognition.toggleRecording();
      }
    });
  }

  protected _initCommands(): void {
    super._initCommands();
    this._recognition.commands.add(
      this._locale.acceptAll,
      () => {
        this._onIaraCommand(this._locale.acceptAll);
        this._documentEditor.revisions.acceptAll();
      },
      ...this._defaultCommandArgs
    );
  }
}

export * from "./config";
export * from "./content";
export * from "./contextMenu";
export * from "./footerBar";
export * from "./inferenceBookmarks";
export * from "./language";
export * from "./navigationFields";
export * from "./selection";
export * from "./shortcuts";
export * from "./style";
export * from "./toolbar";
