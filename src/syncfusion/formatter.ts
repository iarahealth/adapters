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

  public _parseMeasurements(text: string): string {
    const numberMap = [
          { um: '1' },
          { dois: '2' },
          { três: '3' },
          { quatro: '4' },
          { cinco: '5' },
          { seis: '6' },
          { sete: '7' },
          { oito: '8' },
          { nove: '9' }
    ]
    //convert the number by extensive number before the 'por' into numerals and change 'por' to 'x'
    text = numberMap.reduce((a, c) => {
        const [[oldText, newText]] = Object.entries(c)
        return a.replace(new RegExp(`${oldText} (por|x)`, 'gui'), `${newText} x`)
    }, text)
    //convert the number by extensive after the 'por' into numerals and change 'por' to 'x'
    text = numberMap.reduce((a, c) => {
      const [[oldText, newText]] = Object.entries(c)
      return a.replace(new RegExp(`(por|x) ${oldText}`, 'gui'), `x ${newText}`)
    }, text)
   
    //convert the 'por' before or after a number and return the formatted expression without a space ex:1x1
    text = text.replace(/(\d+(?:,\d+)?) (por|x) (?=\d+(?:,\d+)?)/gui, '$1x')
    
    return text
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
    text = this._parseMeasurements(text);

    return text;
  }
}
