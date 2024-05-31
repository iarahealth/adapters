export type Ribbon = {
  //braun
  /*
  ribbonconfig funciona do vazio para o personalizado, na seguinte regra:
  se enviando vazio, puxa todas as opcoes,
  se desejar 1 ou mais opcoes, eh necessario digitar quais opcoes, as nao informadas nao serao carregadas
  o mesmo para os niveis mais inferiores nos botes de cada conjunto
  */

  //  se for true eu quero tudo se false remover o item e se eu mandar array de array eu quero customizado.

  displayMode?: "Classic" | "Simplified";
  collection?: {
    file?: ("open" | "undo" | "redo")[][] | boolean;
    insert?: ("image" | "table")[][] | boolean;
    clipboard?: ("copy" | "cut" | "paste")[][] | boolean;
    font?:
      | (
          | "fontFamily"
          | "fontSize"
          | "fontColor"
          | "bold"
          | "italic"
          | "underline"
          | "strikeThrough"
        )[][]
      | boolean;
    paragraph?:
      | (
          | "decreaseIdent"
          | "increaseIdent"
          | "lineSpacing"
          | "bullets"
          | "numbering"
          | "paragraphMark"
          | "alignment"
        )[][]
      | boolean;
    navigation?: "navigationField"[][] | boolean;
    documentReview?: "trackchanges"[][] | boolean;
    export?: "exportPdf"[][] | boolean;
  };
};

export type RibbonCollection =
  | "file"
  | "insert"
  | "clipboard"
  | "font"
  | "paragraph"
  | "navigation"
  | "export"
  | "documentReview";

export type RibbonCustomItems =
  | ("open" | "undo" | "redo")[][]
  | ("image" | "table")[][]
  | ("copy" | "cut" | "paste")[][]
  | (
      | "fontFamily"
      | "fontSize"
      | "fontColor"
      | "bold"
      | "italic"
      | "underline"
      | "strikeThrough"
    )[][]
  | (
      | "decreaseIdent"
      | "increaseIdent"
      | "lineSpacing"
      | "bullets"
      | "numbering"
      | "paragraphMark"
      | "alignment"
    )[][]
  | "navigationField"[][]
  | "trackchanges"[][]
  | "exportPdf"[][];
