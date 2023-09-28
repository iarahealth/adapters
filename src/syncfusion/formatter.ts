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

  private _estimateVolume(text: string, wordBefore: string) {
    let textCalculate = text
    console.log('wordBefore', wordBefore)

    //
    // const numberMap = [
    //   { um: '1' },
    //   { dois: '2' },
    //   { três: '3' },
    //   { quatro: '4' },
    //   { cinco: '5' },
    //   { seis: '6' },
    //   { sete: '7' },
    //   { oito: '8' },
    //   { nove: '9' }
    // ]

    // //convert the number by extensive number before the 'por' into numerals and change 'por' to 'x'
    // textCalculate = numberMap.reduce((a, c) => {
    //     const [[oldText, newText]] = Object.entries(c)
    //     return a.replace(new RegExp(`${oldText} (por|x)`, 'gui'), `${newText} x`)
    // }, textCalculate)
    // //convert the number by extensive after the 'por' into numerals and change 'por' to 'x'
    // textCalculate = numberMap.reduce((a, c) => {
    //   const [[oldText, newText]] = Object.entries(c)
    //   return a.replace(new RegExp(`(por|x) ${oldText}`, 'gui'), `x ${newText}`)
    // }, textCalculate)

    // //convert the 'por' before or after a number and return the formatted expression without a space ex:1x1
    // textCalculate = textCalculate.replace(/(\d+(?:,\d+)?) (por|x) (?=\d+(?:,\d+)?)/gui, '$1x')
    //
    
    let converted = false;
    const iterator = textCalculate.matchAll(RegExp('(\\d+(?:,\\d+)?)(\\spor\\s|x)(\\d+(?:,\\d+)?)(\\spor\\s|x)(\\d+(?:,\\d+)?) (cm|mm)(?!\\s\\(|³)', 'giu'));
    const matches = [...iterator];

    console.log('matches', matches)

    matches.forEach((match) => {
      console.log('match', match, match.length)
      // Check if all desired groups were captured
      if (match && match.length === 7) {
        // Volume estimation given 3 elipsoid radius
        // original formula is: 4/3 * π * a * b * c
        // where a, b and c are elipsoid radius
        let volume =
          (4 / 3) *
          Math.PI *
          parseFloat(match[1].replace(',', '.')) *
          parseFloat(match[3].replace(',', '.')) *
          parseFloat(match[5].replace(',', '.'));

        // If user dictated measures as diameter
        // then each one must be converted to radius:
        // (4/3 * π * (a/2) * (b/2) * (c/2))
        
          // Volume estimation given 3 elipsoid radius
          volume /= 8;
        
        if (volume >= 1000 && match[6] == 'mm') {
          // convert the volume from mm³ to cm³
          volume /= 1000;
          converted = true;
        }
        // Round volume to 2 decimal places
        const estimation = `${
          Math.round(volume * Math.pow(10, 2)) / Math.pow(10, 2)
          }`.replace('.', ',');
        
        textCalculate = textCalculate.replace(
          match[0],
          `${match[0].replace('por', 'x')} (volume estimado em ${estimation} ${converted ? 'cm' : match[6]}${match[6] === 'cm'||match[6] === 'mm' ? '³': ''})`,
        );

        console.log('volume', volume, converted, estimation)
      }
    });
    console.log('text', textCalculate)
    return textCalculate;
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
    text = this._estimateVolume(text, wordBefore);

    return text;
  }
}
