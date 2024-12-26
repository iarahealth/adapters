import { IaraSpeechRecognitionDetail } from "../speech";

export class IaraEditorInferenceFormatter {
  public _addTrailingSpaces(
    text: string,
    wordAfter: string,
    wordBefore: string,
    isAtStartOfLine: boolean
  ): string {
    //\u00A0\u200C are non-breaking space and zero-width non-joiner respectively
    const wordBeforeEndsInSpace = /([ \u00A0\u200C]+)([\n\r\v]+)?$/.test(
      wordBefore
    );
    const textStartsWithPunctuation = /^[.,:;?!]/.test(text);
    const addSpaceBefore =
      !textStartsWithPunctuation && !wordBeforeEndsInSpace && !isAtStartOfLine;

    const wordAfterStartsWithSpaceOrNewLine = /^[\s\u00A0\u200C]/.test(
      wordAfter
    );
    const wordAfterStartsWithPunctuation = /^[.,:;?!]/.test(wordAfter);
    const textEndsWithSpaceOrNewLine = /\s$/.test(text);
    const addSpaceAfter =
      wordAfter.length &&
      !wordAfterStartsWithSpaceOrNewLine &&
      !wordAfterStartsWithPunctuation &&
      !textEndsWithSpaceOrNewLine;

    return `${addSpaceBefore ? " " : ""}${text}${addSpaceAfter ? " " : ""}`;
  }

  public _capitalize(text: string, wordBefore: string): string {
    wordBefore = wordBefore.trim();
    const capitalize = !wordBefore.length || /[.:;?!\n\r\v]$/.test(wordBefore);
    return capitalize
      ? `${text.charAt(0).toLocaleUpperCase()}${text.slice(1)}`
      : text;
  }

  protected _estimateVolume(text: string, regex: string): string {
    let converted = false;
    const iterator = text.matchAll(RegExp(regex, "giu"));
    const matches = [...iterator];

    matches.forEach(match => {
      // Check if all desired groups were captured
      if (match && match.length === 7) {
        // Volume estimation given 3 elipsoid radius
        // original formula is: 4/3 * π * a * b * c
        // where a, b and c are elipsoid radius
        let volume =
          (4 / 3) *
          Math.PI *
          parseFloat(match[1].replace(",", ".")) *
          parseFloat(match[3].replace(",", ".")) *
          parseFloat(match[5].replace(",", "."));

        // If user dictated measures as diameter
        // then each one must be converted to radius:
        // (4/3 * π * (a/2) * (b/2) * (c/2))

        // Volume estimation given 3 elipsoid radius
        volume /= 8;

        if (volume >= 1000 && match[6] == "mm") {
          // convert the volume from mm³ to cm³
          volume /= 1000;
          converted = true;
        }
        // Round volume to 2 decimal places
        const estimation = `${
          Math.round(volume * Math.pow(10, 2)) / Math.pow(10, 2)
        }`.replace(".", ",");

        text = text.replace(
          match[0],
          `${match[0].replace("por", "x")} (volume estimado em ${estimation} ${
            converted ? "cm" : match[6]
          }${match[6] === "cm" || match[6] === "mm" ? "³" : ""})`
        );
      }
    });
    return text;
  }

  protected _parseMeasurements(text: string): string {
    const numberMap = [
      { um: "1" },
      { dois: "2" },
      { três: "3" },
      { quatro: "4" },
      { cinco: "5" },
      { seis: "6" },
      { sete: "7" },
      { oito: "8" },
      { nove: "9" },
    ];
    //convert the number by extensive number before the 'por' into numerals and change 'por' to 'x'
    text = numberMap.reduce((a, c) => {
      const [[oldText, newText]] = Object.entries(c);
      return a.replace(new RegExp(`${oldText} (por|x)`, "gui"), `${newText} x`);
    }, text);
    //convert the number by extensive after the 'por' into numerals and change 'por' to 'x'
    text = numberMap.reduce((a, c) => {
      const [[oldText, newText]] = Object.entries(c);
      return a.replace(new RegExp(`(por|x) ${oldText}`, "gui"), `x ${newText}`);
    }, text);

    return text;
  }

  format(
    inference: IaraSpeechRecognitionDetail,
    wordBefore: string,
    wordAfter: string,
    isAtStartOfLine: boolean
  ): string {
    let text = inference.richTranscript
      .replace(/^<div>/, "")
      .replace(/<\/div>$/, "");
    text = text.trim();
    text = text.replace(/\s*<\/div><div>\s*/g, "\n");

    if (text.length === 0) return text;

    text = this._parseMeasurements(text);

    // expression to estimate volume
    text = this._estimateVolume(
      text,
      "(\\d+(?:,\\d+)?)(\\spor\\s|x)(\\d+(?:,\\d+)?)(\\spor\\s|x)(\\d+(?:,\\d+)?) (cm³|mm³)(?!\\s\\()"
    );
    text = this._estimateVolume(
      text,
      "(\\d+(?:,\\d+)?)(\\spor\\s|x)(\\d+(?:,\\d+)?)(\\spor\\s|x)(\\d+(?:,\\d+)?) (cm|mm)(?!\\s\\(|³)"
    );

    text = this._capitalize(text, wordBefore);
    if (text.trim().length) {
      text = this._addTrailingSpaces(
        text,
        wordAfter,
        wordBefore,
        isAtStartOfLine
      );
    }

    return text;
  }
}
