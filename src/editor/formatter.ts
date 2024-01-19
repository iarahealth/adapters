import { IaraSpeechRecognitionDetail } from "../speech";

export class IaraEditorInferenceFormatter {
  public _addTrailingSpaces(
    text: string,
    wordAfter: string,
    wordBefore: string
  ): string {
    const addSpaceBefore =
      wordBefore.length && !wordBefore.endsWith(" ") && !/^[.,:;?!]/.test(text);

    const addSpaceAfter =
      wordAfter.length &&
      !wordAfter.startsWith(" ") &&
      !/^[.,:;?!]/.test(wordAfter);

    return `${addSpaceBefore ? " " : ""}${text}${addSpaceAfter ? " " : ""}`;
  }

  public _capitalize(text: string, wordBefore: string): string {
    text = text.trimStart();
    wordBefore = wordBefore.trimEnd();

    const capitalize = !wordBefore.length || /[.:;?!]$/.test(wordBefore);
    var capitalized_text = `${text.charAt(0).toLocaleUpperCase()}${text.slice(1)}`;

    return capitalize
      ? wordBefore.length == 0 ? capitalized_text : ' ' + capitalized_text
      : wordBefore.length == 0 ? text : ' ' + text;
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

    //convert the 'por' before or after a number and return the formatted expression without a space ex:1x1
    text = text.replace(/(\d+(?:,\d+)?) (por|x) (?=\d+(?:,\d+)?)/giu, "$1x");

    return text;
  }

  format(
    inference: IaraSpeechRecognitionDetail,
    _wordBefore: string,
    _wordAfter: string
  ): string {
    let text = inference.richTranscript
      .replace(/^<div>/, "")
      .replace(/<\/div>$/, "");

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

    text = this._addTrailingSpaces(text, _wordAfter, _wordBefore);
    text = this._capitalize(text, _wordBefore);

    return text;
  }
}
