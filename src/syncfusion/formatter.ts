import type { Selection } from "@syncfusion/ej2-documenteditor";
import { IaraInference } from "../speech";

interface SelectionOffsets {
  end: string;
  start: string;
}

export class IaraSyncfusionInferenceFormatter {
  constructor(private _selection: Selection) {}

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

  private _copyContent(isCut: boolean, selectionOffsets: SelectionOffsets) {
    this._selection.selectAll();
    this._selection.copySelectedContent(isCut);
    this._selection.select(selectionOffsets.start, selectionOffsets.end);
  }

  private _iaraServices(command: string, selectionOffsets: SelectionOffsets) {
    // iara copiar laudo
    if (command.includes('iara copiar laudo')) {
      this._copyContent(false, selectionOffsets);
      alert('Laudo copiado para a área de transferência (CTRL + C)');
      return command.replace(/iara copiar laudo/g,'');
    }

    // iara finalizar laudo
    if (command.includes('iara finalizar laudo')) {
      this._copyContent(true, selectionOffsets);
      alert('Laudo copiado para a área de transferência (CTRL + C) e o editor de texto foi limpo.');
      return command.replace(/iara finalizar laudo/g,'');
    }

    return command;
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
    text = this._iaraServices(text, initialSelectionOffsets);

    return text;
  }
}
