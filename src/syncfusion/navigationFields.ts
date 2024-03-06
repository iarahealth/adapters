import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";

let bookmarksCount = 0;

export const createNavigationFields: (editor: DocumentEditorContainer) => void =
  (editor: DocumentEditorContainer) => {
    bookmarksCount = bookmarksCount + 1;
    editor.documentEditor.editor.insertBookmark(`Bookmark${bookmarksCount}`);
    const content = "Escreva uma dica de texto";
    const title = "Nome do campo";
    editor.documentEditor.editor.insertText("[]");
    editor.documentEditor.selection.movePreviousPosition();
    editor.documentEditor.editor.insertText("<>");
    editor.documentEditor.selection.movePreviousPosition();
    editor.documentEditor.selection.characterFormat.highlightColor = "Gray50";
    editor.documentEditor.editor.insertText(`${title}`);
    editor.documentEditor.selection.clear();
    editor.documentEditor.selection.moveNextPosition();
    editor.documentEditor.selection.characterFormat.highlightColor = "Gray25";
    editor.documentEditor.editor.insertText(`${content}`);
    editor.documentEditor.selection.selectBookmark(
      `Bookmark${bookmarksCount}`,
      true
    );
    selectTitle(editor, content);
  };

const selectTitle = (editor: DocumentEditorContainer, content: string) => {
  const startOffset = editor.documentEditor.selection.startOffset.split(";");
  //add 2 positions so as not to select [ or <
  startOffset[2] = String(
    Number(editor.documentEditor.selection.startOffset.split(";")[2]) + 2
  );
  const start = startOffset.join(";");

  const endOffset = editor.documentEditor.selection.endOffset.split(";");
  //remove the content size plus 2 positions so as not to select > or ]
  endOffset[2] = String(
    Number(editor.documentEditor.selection.endOffset.split(";")[2]) -
      (content.length + 2)
  );
  const end = endOffset.join(";");
  editor.documentEditor.selection.select(start, end);
};
