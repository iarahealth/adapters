import type {
  DocumentEditorContainer,
  Selection,
} from "@syncfusion/ej2-documenteditor";

interface SelectionOffsets {
  end: string;
  start: string;
}

export class IaraSyncfusionSelectionManager {
  public get selection(): Selection {
    return this._editor.documentEditor.selection;
  }

  constructor(private _editor: DocumentEditorContainer) {}

  public getWordAfterSelection(selectionOffsets: SelectionOffsets): string {
    this.selection.extendToWordEnd();
    const wordAfter = this.selection.text.trimEnd();
    this.selection.select(selectionOffsets.start, selectionOffsets.end);
    return wordAfter;
  }

  public getWordBeforeSelection(selectionOffsets: SelectionOffsets): string {
    this.selection.extendToWordStart();
    const wordBefore = this.selection.text.trimStart();
    this.selection.select(selectionOffsets.start, selectionOffsets.end);
    return wordBefore;
  }
}
