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
import { EditorAdapter, IaraEditorConfig } from "../editor";
import { IaraSpeechRecognition, IaraSpeechRecognitionDetail } from "../speech";
import { IaraSFDT, IaraSyncfusionEditorContentManager } from "./content";
import { IaraSyncfusionContextMenuManager } from "./contextMenu";
import {
  IaraInferenceBookmark,
  IaraSyncfusionInferenceBookmarksManager,
} from "./inferenceBookmarks";
import { IaraSyncfusionLanguageManager } from "./language";
import { IaraSyncfusionNavigationFieldManager } from "./navigationFields/index";
import { IaraSyncfusionSelectionManager } from "./selection";
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

export interface IaraSyncfusionConfig extends IaraEditorConfig {
  replaceToolbar: boolean;
  showBookmarks: boolean;
}

export class IaraSyncfusionAdapter
  extends EditorAdapter
  implements EditorAdapter
{
  public static IARA_API_URL = "https://api.iarahealth.com/";
  private _contentManager: IaraSyncfusionEditorContentManager;
  private _contentDate?: Date;
  private _cursorSelection?: { startOffset: string; endOffset: string };
  private _debouncedSaveReport: () => void;
  private _documentEditor: DocumentEditor;
  private _editorContainer?: DocumentEditorContainer;
  private _selectionManager?: IaraSyncfusionSelectionManager;
  private _toolbarManager?: IaraSyncfusionToolbarManager;
  private _languageManager: IaraSyncfusionLanguageManager;
  private _inferenceBookmarksManager: IaraSyncfusionInferenceBookmarksManager;

  protected _navigationFieldManager: IaraSyncfusionNavigationFieldManager;
  protected static DefaultConfig: IaraSyncfusionConfig = {
    ...EditorAdapter.DefaultConfig,
    replaceToolbar: false,
    showBookmarks: false,
  };
  protected _styleManager: IaraSyncfusionStyleManager;

  public defaultFormat: CharacterFormatProperties = {};
  public savingReportSpan = document.createElement("span");
  public timeoutToSave: ReturnType<typeof setTimeout> | undefined;

  public get contentManager(): IaraSyncfusionEditorContentManager {
    return this._contentManager;
  }
  public get documentEditor(): DocumentEditor {
    return this._documentEditor;
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

    this._contentManager = new IaraSyncfusionEditorContentManager(
      this._documentEditor,
      () => (this.config.saveReport ? this._debouncedSaveReport() : undefined)
    );

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

    DocumentEditor.Inject(Print);

    this._documentEditor.enablePrint = true;
    this._documentEditor.enableImageResizer = true;

    this._debouncedSaveReport = this._debounce(this._saveReport.bind(this));

    this._documentEditor.addEventListener(
      "destroyed",
      this._onEditorDestroyed.bind(this)
    );

    new IaraSyncfusionShortcutsManager(
      this._documentEditor,
      _recognition,
      this.onTemplateSelectedAtShortCut.bind(this),
      this._navigationFieldManager
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
  }

  blockEditorWhileSpeaking(status: boolean): void {
    const wrapper = document.getElementById("iara-syncfusion-editor-container");
    if (wrapper) wrapper.style.cursor = status ? "not-allowed" : "auto";
  }

  private _wrapElementWithLegacyStyles(element: HTMLElement): void {
    if (element.style.fontWeight === "bold") {
      element.innerHTML = element.innerHTML.replace(/^( )+$/giu, "&nbsp;");
      element.innerHTML = `<strong>${element.innerHTML}</strong>`;
    }
    if (element.style.fontStyle === "italic") {
      element.innerHTML = `<em>${element.innerHTML}</em>`;
    }
    if (element.style.textDecoration === "underline") {
      element.innerHTML = `<u>${element.innerHTML}</u>`;
    }
    if (element.style.textDecoration === "line-through") {
      element.innerHTML = `<s>${element.innerHTML}</s>`;
    }
  }

  private _preprocessClipboardHtml(html: string): string {
    // Wrap paragraph and span tags in strong tags if font-weight is bold to support older editors (tiny v3)
    const document = new DOMParser().parseFromString(html, "text/html");

    const paragraphs = [...document.getElementsByTagName("p")];
    paragraphs.forEach(paragraph => {
      // Allow breaking long lines
      paragraph.style.whiteSpace = "normal";
      this._wrapElementWithLegacyStyles(paragraph);
    });

    const spans = [...document.getElementsByTagName("span")];
    spans.forEach(span => this._wrapElementWithLegacyStyles(span));

    html = document.body.innerHTML;

    // Some needed processing for the clipboard html:
    // 1. Remove the meta tag that comes from the clipboard, it will be readded automatically.
    // 2. Remove any `a` tags from the html, as they may be incorrectly handled as links on the
    //    target editor. These tags are added by our bookmarks, and can be safely removed.
    // 3. Replace empty paragraphs for a simpler paragraph with a line break
    // 4. Pretend this html comes from tinymce by adding the <!-- x-tinymce/html --> comment.
    html = html
      .replace(/<(meta|a) [^>]+>/giu, "")
      .replace(/<\/a>/giu, "")
      .replace(
        /(<p [^>]+>)<span( [^>]+)?>(<strong><\/strong>)?\s+<\/span>(<\/p>)/giu,
        "$1&nbsp;</p>"
      );
    html = `<!-- x-tinymce/html -->${html}`;

    return html;
  }

  async copyReport(): Promise<string[]> {
    this.showSpinner();

    this._documentEditor.revisions.acceptAll();
    this._documentEditor.enableTrackChanges = false;
    this._documentEditor.focusIn();
    this._documentEditor.selection.selectAll();
    this._documentEditor.selection.copy();

    try {
      const content = await this._contentManager.getContent();

      // By pretending our html comes from google docs, we can paste it into
      // tinymce without losing the formatting for some reason.
      const htmlContent = content[1].replace(
        '<div class="Section0">',
        '<div class="Section0" id="docs-internal-guid-iara">'
      );
      this._recognition.automation.copyText(
        content[0],
        htmlContent,
        content[2]
      );
      this.hideSpinner();
      this._documentEditor.selection.moveNextPosition();

      return content.slice(0, 3);
    } catch (error) {
      console.error(error);
      this.hideSpinner();
      this._documentEditor.selection.moveToDocumentStart();
      throw error;
    }
  }

  clearReport(): void {
    this._documentEditor.enableTrackChanges = false;
    this._documentEditor.selection?.selectAll();
    this._documentEditor.editor?.delete();
    if (this._documentEditor.editor) this._styleManager?.setEditorDefaultFont();
  }

  getEditorContent(): Promise<[string, string, string, string]> {
    return this._contentManager.getContent();
  }

  private _formatSectionTitle(titleQueries: string[]): void {
    let matchedQuery = "";
    while (!matchedQuery && titleQueries.length) {
      const query = titleQueries.shift();
      if (!query) continue;

      this._documentEditor.search.findAll(query);
      if (this._documentEditor.search.searchResults.length) {
        matchedQuery = query;
        this._documentEditor.selection.characterFormat.bold = true;
      }
    }

    this._documentEditor.search.searchResults.clear();
  }

  async finishReport(): Promise<void> {
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

    await super.finishReport();
    this._inferenceBookmarksManager.clearBookmarks();
  }

  formatSectionTitles(): void {
    this._formatSectionTitle([
      "Técnica:",
      "Técnica de Exame:",
      "Técnica do Exame:",
    ]);
    this._formatSectionTitle(["Contraste:"]);
    this._formatSectionTitle([
      "Histórico Clínico:",
      "Indicação:",
      "Indicação Clínica:",
      "Informações Clínicas:",
    ]);
    this._formatSectionTitle(["Exames Anteriores:"]);
    this._formatSectionTitle([
      "Análise:",
      "Interpretação:",
      "Os seguintes aspectos foram observados:",
      "Relatório:",
    ]);
    this._formatSectionTitle(["Objetivo:"]);
    this._formatSectionTitle([
      "Conclusão:",
      "Hipótese Diagnóstica:",
      "Impressão Diagnóstica:",
      "Impressão:",
      "Resumo:",
      "Observação:",
      "Observações:",
      "Opinião:",
    ]);
    this._formatSectionTitle([
      "Achados:",
      "Achados Adicionais:",
      "Comparação:",
      "Demais Achados:",
      "Método:",
      "Protocolo:",
    ]);
  }

  formatTitle(): void {
    this._documentEditor.selection.moveToDocumentEnd();
    const lastParagraph = parseInt(
      this._documentEditor.selection.endOffset.split(";")[1]
    );
    this._documentEditor.selection.moveToDocumentStart();

    let titleLine = "";
    let currentParagraph = 0;
    while (!titleLine && currentParagraph <= lastParagraph) {
      this._documentEditor.selection.selectLine();
      titleLine = this._documentEditor.selection.text.trim();
      currentParagraph++;
    }
    if (titleLine) {
      this._documentEditor.selection.characterFormat.bold = true;
      this._documentEditor.selection.characterFormat.allCaps = true;
      this._documentEditor.selection.paragraphFormat.textAlignment = "Center";
    }
  }

  hideSpinner(): void {
    hideSpinner(this._documentEditor.editor.documentHelper.viewerContainer);
  }

  insertParagraph(): void {
    this._documentEditor.editor.insertText("\n");
  }

  async insertTemplate(
    content: string,
    replaceAllContent = false
  ): Promise<void> {
    const sfdt = await this.contentManager.fromContent(content);
    if (replaceAllContent) this._documentEditor.open(sfdt.value);
    else {
      this._documentEditor.editor.paste(sfdt.value);
      this._documentEditor.editor.onBackSpace();
    }

    this._documentEditor.selection.moveToDocumentStart();

    // Set the default editor format after inserting the template
    this._styleManager.setEditorDefaultFont({
      fontFamily: this._documentEditor.selection.characterFormat.fontFamily,
      fontSize: this._documentEditor.selection.characterFormat.fontSize,
      fontColor: this.config.darkMode ? "#fff" : "#000",
    });

    this._navigationFieldManager.getBookmarks();
    this._documentEditor.selection.moveToDocumentEnd();
  }

  insertText(text: string): void {
    const [firstLine, ...lines]: string[] = text.split("\n");
    this._documentEditor.editor.insertText(firstLine);
    lines.forEach(line => {
      this.insertParagraph();
      line = line.trimStart();
      if (line) this._documentEditor.editor.insertText(line);
    });
  }

  insertInference(inference: IaraSpeechRecognitionDetail): void {
    if (
      inference.transcript == "" ||
      (inference.richTranscriptModifiers?.length && !inference.isFinal)
    )
      return;

    if (inference.isFirst) {
      this._handleFirstInference(inference);
    } else if (this._selectionManager) {
      this._selectionManager.resetSelection(false);
    }

    if (!this._selectionManager) return;

    this._inferenceBookmarksManager.updateBookmarkInference(
      this._selectionManager.initialSelectionData.bookmarkId,
      inference
    );

    if (
      inference.richTranscriptModifiers?.length &&
      inference.richTranscriptWithoutModifiers
    ) {
      const insertedTemplate = this._handleTemplateOrPhraseInference(inference);
      if (insertedTemplate) return;
    }
    const text = this._inferenceFormatter.format(
      inference,
      this._selectionManager.wordBeforeSelection,
      this._selectionManager.wordAfterSelection,
      this._selectionManager.isAtStartOfLine
    );

    if (text.length) this.insertText(text);

    if (this._selectionManager.initialSelectionData.characterFormat.allCaps) {
      // Insert text is not respecting the allCaps property, work around that
      this._selectionManager.selectBookmark(
        this._selectionManager.initialSelectionData.bookmarkId
      );
      this._documentEditor.selection.characterFormat.allCaps = true;
    }

    if (inference.isFinal) {
      if (text.length) {
        this._selectionManager.moveSelectionToAfterBookmarkEdge(
          this._selectionManager.initialSelectionData.bookmarkId
        );
      } else {
        this._selectionManager.selectBookmark(
          this._selectionManager.initialSelectionData.bookmarkId,
          false
        );
        this._documentEditor.editor.delete();
      }
    }
  }

  moveToDocumentEnd() {
    this._documentEditor.selection.moveToDocumentEnd();
  }

  undo(): void {
    this._documentEditor.editorHistory.undo();
  }

  private _debounce(func: () => unknown) {
    let timer: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func();
      }, 1000);
    };
  }

  private async _saveReport(): Promise<void> {
    if (this._documentEditor.isDocumentEmpty) return;
    if (!this._recognition.report["_key"]) await this._beginReport();

    let spanContent = "";
    try {
      const contentDate = new Date();
      this._contentDate = contentDate;

      const content: string[] = await this._contentManager.getContent();
      const element = document.querySelector(".e-de-status-bar");

      if (element) {
        this.savingReportSpan.style.width = "120px";
        this.savingReportSpan.style.margin = "10px";
        this.savingReportSpan.style.fontSize = "12px";
        this.savingReportSpan.style.color = "black";
        spanContent =
          this._languageManager.languages.language.iaraTranslate.saveMessage
            .loading;
        this.savingReportSpan.innerHTML = `<span class="e-icons e-refresh-2" style="margin-right: 4px"></span>${spanContent}`;
        element.insertBefore(this.savingReportSpan, element.firstChild);
      }

      if (contentDate !== this._contentDate) return;

      await this._updateReport(content[0], content[1]);
      spanContent =
        this._languageManager.languages.language.iaraTranslate.saveMessage
          .success;
      this.savingReportSpan.innerHTML = `<span class="e-icons e-check" style="margin-right: 4px; color: #b71c1c"></span>${spanContent}`;
    } catch {
      spanContent =
        this._languageManager.languages.language.iaraTranslate.saveMessage
          .error;
      this.savingReportSpan.innerHTML = `<span class="e-icons e-warning" style="margin-right: 4px; color: #ffb300"></span>${spanContent}`;
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
          this.undo();

          if (item.category === "Template") {
            if (this.preprocessAndInsertTemplate)
              this.preprocessAndInsertTemplate?.(item.content, item);
            else this.insertTemplate(item.content);
          } else this.insertText(item.content);

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
    this.insertText(content);
  }

  showSpinner(): void {
    showSpinner(this._documentEditor.editor.documentHelper.viewerContainer);
  }

  private _setScrollClickHandler() {
    this._documentEditor
      .getRootElement()
      .addEventListener("mousedown", event => {
        if (event.button === 1) {
          if (this._documentEditor.selection.text.length > 0)
            this._documentEditor.editor.delete();
          this._cursorSelection = {
            startOffset: this._documentEditor.selection.startOffset,
            endOffset: this._documentEditor.selection.endOffset,
          };
        }
      });

    this._documentEditor.getRootElement().addEventListener("mouseup", event => {
      if (event.button === 1 && this._cursorSelection) {
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

  private _updateSelectedNavigationField(field: string): void {
    if (field.match(/\[(.*)\]/)) {
      const { title, content } =
        this._navigationFieldManager.getTitleAndContent(field);

      let type: "Field" | "Mandatory" | "Optional" = "Field";
      if (content.includes("*")) type = "Mandatory";
      if (content.includes("?")) type = "Optional";

      this.selectedField = {
        content,
        title,
        type,
      };
    } else this.selectedField = { content: "", title: "", type: "Field" };
  }

  private _handleFirstInference(inference: IaraSpeechRecognitionDetail): void {
    this._updateSelectedNavigationField(this._documentEditor.selection.text);
    const hadSelectedText = this._documentEditor.selection.text.length;

    if (hadSelectedText) this._documentEditor.editor.delete();

    this._selectionManager = new IaraSyncfusionSelectionManager(
      this._documentEditor,
      this.config,
      inference.inferenceId
        ? `inferenceId_${inference.inferenceId}`
        : undefined,
      true,
      this.config.highlightInference
    );

    this._inferenceBookmarksManager.addBookmark(
      inference,
      this._selectionManager.initialSelectionData.bookmarkId
    );

    if (this._selectionManager.wordBeforeSelection.endsWith(" ")) {
      // Removes trailing space so that the formatter can determine whether the space is required or not.
      // I.e. if the inference starts with a punctuation, there would be an extra space.
      this._selectionManager.moveSelectionToBeforeBookmarkEdge(
        this._selectionManager.initialSelectionData.bookmarkId
      );
      if (!hadSelectedText) {
        this._documentEditor.selection.moveToPreviousCharacter();
        this._documentEditor.selection.extendForward();
        this._documentEditor.editor.delete();
        this._selectionManager.wordBeforeSelection =
          this._selectionManager.wordBeforeSelection.slice(0, -1);
      }
      this._selectionManager.resetSelection();
    }
  }

  private _handleTemplateOrPhraseInference(
    inference: IaraSpeechRecognitionDetail
  ): boolean {
    if (
      !inference.richTranscriptModifiers?.length ||
      !inference.richTranscriptWithoutModifiers
    )
      return false;

    const phraseOrTemplate =
      this._recognition.richTranscriptTemplates.templates[
        inference.richTranscriptModifiers[0]
      ];
    const metadata = phraseOrTemplate.metadata as { category?: string };

    const contentType = IaraSFDT.detectContentType(
      phraseOrTemplate.replaceText
    );

    // contentType equal plain_text the content is a phrase
    if (metadata.category === "Template" || contentType !== "plain_text") {
      const index: number | undefined =
        inference.richTranscriptWithoutModifiers.match(
          new RegExp(`iara texto ${inference.richTranscriptModifiers[0]}`, "ui")
        )?.index;

      const templatePrefix = inference.richTranscript
        .slice(0, index)
        .replace(/^<div>/, "");
      const template = inference.richTranscript
        .slice(index)
        .replace(/<\/div>$/, "");

      this.insertInference({
        ...inference,
        ...{ richTranscript: templatePrefix, richTranscriptModifiers: [] },
      });
      if (this.preprocessAndInsertTemplate)
        this.preprocessAndInsertTemplate?.(template, metadata);
      else this.insertTemplate(template);
      return true;
    }

    return false;
  }
}
