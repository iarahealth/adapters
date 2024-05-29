export interface RibbonOptions {
  //braun
  /*
  ribbonconfig funciona do vazio para o personalizado, na seguinte regra:
  se enviando vazio, puxa todas as opcoes,
  se desejar 1 ou mais opcoes, eh necessario digitar quais opcoes, as nao informadas nao serao carregadas
  o mesmo para os niveis mais inferiores nos botes de cada conjunto
  */

  displayMode?: "Classic" | "Simplified";
  ribbonItems?: {
    file?: ("open" | "undo" | "redo")[];
    insert?: ("image" | "table")[][];
    clipboard?: ("copy" | "cut" | "paste")[][];
    font?: (
      | "fontFamily"
      | "fontSize"
      | "fontColor"
      | "bold"
      | "italic"
      | "underline"
      | "strikeThrough"
    )[][];
    paragraph?: (
      | "decreaseIdent"
      | "increaseIdent"
      | "lineSpacing"
      | "bullets"
      | "numbering"
      | "paragraphMark"
      | "alignLeft"
      | "alignCenter"
      | "alignRight"
      | "justify"
    )[][];
    navigation?: "navigation";
    trackchanges?: "trackchanges";
    export?: "export";
  };
}
