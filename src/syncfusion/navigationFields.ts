import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";

let bookmarksCount = 0;

export const createNavigationFields: (editor: DocumentEditorContainer) => void =
  (editor: DocumentEditorContainer) => {
    bookmarksCount = bookmarksCount + 1;
    editor.documentEditor.editor.insertBookmark(`Bookmark${bookmarksCount}`);
    editor.documentEditorSettings.showBookmarks = true;
    editor.documentEditor.editor.insertText("Escreva uma dica de texto");
    editor.documentEditor.selection.selectBookmark(
      `Bookmark${bookmarksCount}`,
      true
    );
  };
