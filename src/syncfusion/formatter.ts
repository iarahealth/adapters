import type { Selection } from "@syncfusion/ej2-documenteditor";
import { IaraInference } from "../speech";
import { EditorAdapter } from "../editor";

interface SelectionOffsets {
  end: string;
  start: string;
}

export class IaraSyncfusionInferenceFormatter {
  constructor(private _selection: Selection, private _editor: EditorAdapter) {}

  private _addTrailingSpaces(
    text: string,
    wordAfter: string,
    wordBefore: string
  ) {
    const addSpaceBefore =
      wordBefore.length &&
      !wordBefore.endsWith(" ") &&
      !/^[\.,:;?!]/.test(text);

    const addSpaceAfter =
      wordAfter.length &&
      !wordAfter.startsWith(" ") &&
      !/^[\.,:;?!]/.test(wordAfter);

    return `${addSpaceBefore ? " " : ""}${text}${addSpaceAfter ? " " : ""}`;
  }

  private _capitalize(text: string, wordBefore: string) {
    const capitalize = !wordBefore.length || /[\.:;?!]$/.test(wordBefore);
    return capitalize
      ? `${text.charAt(0).toLocaleUpperCase()}${text.slice(1)}`
      : text;
  }

  private _getWordAfterSelection(selectionOffsets: SelectionOffsets): string {
    this._selection.extendToWordEnd();
    const wordAfter = this._selection.text.trimEnd();
    this._selection.select(selectionOffsets.start, selectionOffsets.end);
    return wordAfter;
  }

  private _getWordBeforeSelection(selectionOffsets: SelectionOffsets): string {
    this._selection.extendToWordStart();
    const wordBefore = this._selection.text.trimStart();
    this._selection.select(selectionOffsets.start, selectionOffsets.end);
    return wordBefore;
  }

  format(inference: IaraInference) {
    let text = inference.richTranscript
      .replace(/^<div>/, "")
      .replace(/<\/div>$/, "");

    const initialSelectionOffsets = {
      end: this._selection.endOffset,
      start: this._selection.startOffset,
    };
    const wordAfter = this._getWordAfterSelection(initialSelectionOffsets);
    const wordBefore = this._getWordBeforeSelection(initialSelectionOffsets);

    text = this._addTrailingSpaces(text, wordAfter, wordBefore);
    text = this._capitalize(text, wordBefore);
    text = this._editor.inferenceFormatter(text);

    return text;
  }
}
