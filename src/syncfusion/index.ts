import type { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import { ListView, SelectedCollection } from "@syncfusion/ej2-lists";
import { Dialog } from "@syncfusion/ej2-popups";
import { EditorAdapter } from "../editor";
import { IaraSpeechRecognition, IaraSpeechRecognitionDetail } from "../speech";
import { IaraSFDT, IaraSyncfusionEditorContentManager } from "./content";
import { IaraSyncfusionSelectionManager } from "./selection";
import { IaraSyncfusionShortcutsManager } from "./shortcuts";
import { IaraSyncfusionStyleManager } from "./style";
import { IaraSyncfusionToolbarManager } from "./toolbar";

export class IaraSyncfusionAdapter
  extends EditorAdapter
  implements EditorAdapter
{
  private _contentManager: IaraSyncfusionEditorContentManager;
  private _debouncedSaveReport: () => void;
  private _initialUndoStackSize = 0;
  private _selectionManager: IaraSyncfusionSelectionManager;
  private _shortcutsManager: IaraSyncfusionShortcutsManager;
  private _toolbarManager: IaraSyncfusionToolbarManager;

  protected _styleManager: IaraSyncfusionStyleManager;

  public savingReportSpan = document.createElement("span");
  public timeoutToSave: ReturnType<typeof setTimeout> | undefined;

  public get contentManager(): IaraSyncfusionEditorContentManager {
    return this._contentManager;
  }

  constructor(
    protected _editor: DocumentEditorContainer,
    protected _recognition: IaraSpeechRecognition,
    replaceToolbar = false
  ) {
    super(_editor, _recognition);
    this._contentManager = new IaraSyncfusionEditorContentManager(
      _editor,
      _recognition,
      this._onContentChange.bind(this)
    );

    this._selectionManager = new IaraSyncfusionSelectionManager(_editor);
    this._shortcutsManager = new IaraSyncfusionShortcutsManager(
      _editor,
      _recognition,
      this.onTemplateSelectedAtShortCut.bind(this)
    );
    this._shortcutsManager.init();
    this._styleManager = new IaraSyncfusionStyleManager(
      _editor,
      this._selectionManager
    );
    this._toolbarManager = new IaraSyncfusionToolbarManager(_editor);

    if (replaceToolbar) this._toolbarManager.init();

    this._debouncedSaveReport = this._debounce(this._saveReport.bind(this));

    this._editor.addEventListener(
      "destroyed",
      this._onEditorDestroyed.bind(this)
    );
  }

  blockEditorWhileSpeaking(status: boolean): void {
    const wrapper = document.getElementById("iara-syncfusion-editor-container");
    if (wrapper) wrapper.style.cursor = status ? "not-allowed" : "auto";
  }

  copyReport(): void {
    this._selectionManager.selection.selectAll();
    this._selectionManager.selection.copySelectedContent(false);
  }

  clearReport(): void {
    this._selectionManager.selection.selectAll();
    this._editor.documentEditor.editor.delete();
  }

  getEditorContent(): Promise<[string, string, string]> {
    return this._contentManager.getContent();
  }

  getUndoStackSize(): number {
    return this._editor.documentEditor.editorHistory.undoStack?.length || 0;
  }

  insertParagraph(): void {
    this._editor.documentEditor.editor.insertText("\n");
  }

  async insertTemplate(html: string, replaceAllContent = false): Promise<void> {
    const sfdt = await IaraSFDT.fromHtml(
      html,
      this._recognition.internal.iaraAPIMandatoryHeaders as HeadersInit
    );
    if (replaceAllContent) this._editor.documentEditor.open(sfdt.value);
    else this._editor.documentEditor.editor.paste(sfdt.value);
  }

  insertText(text: string): void {
    this._editor.documentEditor.editor.insertText(text);
  }

  insertInference(inference: IaraSpeechRecognitionDetail): void {
    if (inference.richTranscriptModifiers?.length && !inference.isFinal) return;

    if (inference.isFirst) {
      if (this._selectionManager.selection.text.length)
        this._editor.documentEditor.editor.delete();
      this._initialUndoStackSize = this.getUndoStackSize();
    } else {
      const undoStackSize = this.getUndoStackSize();
      for (let i = 0; i < undoStackSize - this._initialUndoStackSize; i++)
        this.undo();
    }

    if (inference.richTranscriptModifiers?.length) {
      const removeDivTags = inference.richTranscript
        .replace(/^<div>/, "")
        .replace(/<\/div>$/, "");
      this.insertTemplate(removeDivTags);
      return;
    }

    // Syncfusion formatter
    const initialSelectionOffsets = {
      end: this._selectionManager.selection.endOffset,
      start: this._selectionManager.selection.startOffset,
    };
    const wordBefore = this._selectionManager.getWordBeforeSelection(
      initialSelectionOffsets
    );
    const wordAfter = this._selectionManager.getWordAfterSelection(
      initialSelectionOffsets
    );

    const text = this._inferenceFormatter.format(
      inference,
      wordBefore,
      wordAfter
    );

    const [firstLine, ...lines]: string[] = text.split("</div><div>");
    this.insertText(firstLine);
    lines.forEach(line => {
      this.insertParagraph();
      line = line.trimStart();
      if (line) this.insertText(line);
    });
  }

  undo(): void {
    this._editor.documentEditor.editorHistory.undo();
  }

  private _debounce = (func: () => unknown) => {
    let timer: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func();
      }, 1000);
    };
  };

  private async _onContentChange(): Promise<void> {
    const element = document.querySelector(".e-de-status-bar");
    if (element) {
      this.savingReportSpan.style.margin = "10px";
      this.savingReportSpan.style.fontSize = "12px";
      this.savingReportSpan.style.display = "flex";
      this.savingReportSpan.style.justifyContent = "end";
      this.savingReportSpan.style.color = "black";
      this.savingReportSpan.innerText = "Salvando...";
      element.insertBefore(this.savingReportSpan, element.firstChild);
    }
    this._debouncedSaveReport();
  }

  private async _saveReport(): Promise<void> {
    this.savingReportSpan.innerText = "Salvo";
    this._updateReport(
      await this._contentManager.getPlainTextContent(),
      await this._contentManager.getHtmlContent()
    );
  }

  onTemplateSelectedAtShortCut(
    listViewInstance: ListView,
    dialogObj: Dialog
  ): void {
    document.getElementById("listview")?.addEventListener("click", () => {
      const selecteditem: SelectedCollection =
        listViewInstance.getSelectedItems() as SelectedCollection;
      const item = selecteditem.data as unknown as {
        name: string;
        category: string;
        content: string;
      };
      this.undo();
      this.insertTemplate(item.content);
      dialogObj.hide();
    });
  }
}
