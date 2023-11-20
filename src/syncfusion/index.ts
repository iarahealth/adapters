import type { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
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
    this._shortcutsManager = new IaraSyncfusionShortcutsManager(_editor, _recognition);
    this._styleManager = new IaraSyncfusionStyleManager(
      _editor,
      this._selectionManager
    );
    this._toolbarManager = new IaraSyncfusionToolbarManager(_editor);

    if (replaceToolbar) this._toolbarManager.init();

    this._editor.destroyed = this.finishReport.bind(this);
    this._editor.enableLocalPaste = true;
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

  async insertTemplate(html: string): Promise<void> {
    const sfdt = await IaraSFDT.fromHtml(
      html,
      this._recognition.internal.iaraAPIMandatoryHeaders as HeadersInit
    );
    this._editor.documentEditor.open(sfdt.value);
  }

  insertText(text: string): void {
    this._editor.documentEditor.editor.insertText(text);
  }

  insertInference(inference: IaraSpeechRecognitionDetail): void {
    if (inference.isFirst) {
      if (this._selectionManager.selection.text.length)
        this._editor.documentEditor.editor.delete();
      this._initialUndoStackSize = this.getUndoStackSize();
    } else {
      const undoStackSize = this.getUndoStackSize();
      for (let i = 0; i < undoStackSize - this._initialUndoStackSize; i++)
        this.undo();
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

  private _debounceSave = (func: () => unknown) => {
    if (!this.timeoutToSave) {
      func();
    }
    clearTimeout(this.timeoutToSave);
    this.timeoutToSave = setTimeout(() => {
      this.timeoutToSave = undefined;
      this.savingReportSpan.innerText = "Salvo";
    }, 3000);
  };

  private async _onContentChange(): Promise<void> {
    const element = document.getElementById(
      "iara-syncfusion-editor-container_editor"
    );
    if (element) {
      this.savingReportSpan.style.margin = "10px";
      this.savingReportSpan.style.fontSize = "14px";
      this.savingReportSpan.style.display = "flex";
      this.savingReportSpan.style.justifyContent = "end";
      this.savingReportSpan.style.color = "black";
      this.savingReportSpan.innerText = "Salvando...";
      element.appendChild(this.savingReportSpan);
    }

    this._debounceSave(async () => {
      this._updateReport(
        await this._contentManager.getPlainTextContent(),
        await this._contentManager.getHtmlContent()
      );
    });
  }

  



}
