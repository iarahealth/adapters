export type Ribbon = {
  /*
  *** PORTUGUESE VERSION ***

  Funcionamento:
  Os elementos da interface estão dividos por tema em collections,
  dentro de cada collection estão tipados os itens ou botões do tema.
  Algumas collections possuem carregamento por padrão, portanto são
  automaticamente consideradas true.
  Outras collections tem false por padrão e devem ser marcados
  como true para serem carregados.

  Estas são as Collections que carregam por padrão:
  file, insert, clipboard, font e paragraph

  Estas são as collections que precisam ser marcados como true para carregarem:
  navigation, export e documentReview

  Um carregamento padrão e completo seria da seguinte forma:
  ribbon: {
    collections: {
      navigation: true,
      export: true,
      documentReview: true,
    }
  }

  Da mesma forma, se eu desejar carregar a interface completa exceto pela collection file:
  ribbon: {
    collections: {
      file: false,
      navigation: true,
      export: true,
      documentReview: true,
    }
  }

  Personalização:
  As collections seguem uma sequência padrão, mas a sequência dos itens
  pode ser alterada, desde que informados na configuração.
  como por exemplo:
  file: [['redo', 'undo', 'open']],

  Note que os itens estão dentro de um próprio Array, dentro do Array de file.
  os Arrays internos são obrigatórios e servem para separar os elementos em blocos espaçados:
  file: [['open'], ['undo', 'redo']],
  file: [['open'], ['undo'], ['redo']],

  Da mesma forma que reconfiguramos os elementos internos da Collection também podemos
  utilizar este recurso para subtrair elementos:
  file: [['undo', 'redo']],
  Neste último exemplo o botão de Abrir não constará na interface.

  Outro recurso de Personalização é o displayMode.
  A versão padrão é a Classic, o menu adquire uma altura considerável.
  Sendo o padrão, não precisa ser decladado na configuração.
  Para utilizar o menu reduzido com botões enfileirados e pequenos, utiliza-se o Simplified
  displayMode: "Simplified"


*** ENGLISH VERSION ***

How it works:
The interface elements are divided by theme into collections,
within each collection the theme's items or buttons are typed.
Some collections are loaded by default, so they are
automatically considered true.
Other collections are false by default and must be marked
as true to be loaded.

These are the Collections that load by default:
file, insert, clipboard, font and paragraph

These are the collections that need to be marked as true to load:
navigation, export and documentReview

A standard and complete load would be as follows:
ribbon: {
  collections: {
    navigation: true,
    export: true,
    documentReview: true,
  }
}

Likewise, if I want to load the complete interface except for the file collection:
ribbon: {
  collections: {
    file: false,
    navigation: true,
    export: true,
    documentReview: true,
  }
}

Customization:
The collections follow a standard sequence, but the sequence of the items
can be changed, as long as it is informed in the configuration.
for example:
file: [['redo', 'undo', 'open']],

Note that the items are inside their own Array, inside the file Array.
Internal Arrays are mandatory and are used to separate elements into spaced blocks:
file: [['open'], ['undo', 'redo']],
file: [['open'], ['undo'], ['redo']],

In the same way that we reconfigure the internal elements of the Collection, we can also
use this resource to subtract elements:
file: [['undo', 'redo']],
In this last example, the Open button will not appear in the interface.

Another Customization resource is the displayMode.
The default version is Classic, the menu acquires a considerable height.
As it is the default, it does not need to be declared in the configuration.
To use the reduced menu with small, lined-up buttons, use Simplified.
displayMode: "Simplified"

*/

  displayMode?: "Classic" | "Simplified";
  collections?: {
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
