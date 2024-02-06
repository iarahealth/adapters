import {
  DocumentEditorContainer,
  SelectionCharacterFormat,
} from "@syncfusion/ej2-documenteditor";
import * as EJ2_LOCALE from "@syncfusion/ej2-locale/src/pt-BR.json";
import {
  Ribbon,
  RibbonColorPicker,
  RibbonFileMenu,
} from "@syncfusion/ej2-ribbon";
import { IaraSyncfusionConfig } from "..";
import { tabsConfig } from "./ribbonTabs";

export interface RibbonFontMethods {
  changeFontFamily: (
    args: {
      value: string;
    },
    ribbon?: Ribbon
  ) => void;
  changeFontSize: (args: { value: number }) => void;
  changeFontColor: (args: {
    currentValue: {
      hex: string;
    };
  }) => void;
}

Ribbon.Inject(RibbonFileMenu, RibbonColorPicker);

const toolbarButtonClick = (
  arg: string,
  editor: DocumentEditorContainer
): void => {
  switch (arg) {
    case "undo":
      editor.documentEditor.editorHistory.undo();
      break;
    case "redo":
      editor.documentEditor.editorHistory.redo();
      break;
    case "cut":
      editor.documentEditor.focusIn();
      editor.documentEditor.selection.selectAll();
      editor.documentEditor.editor.cut();
      editor.documentEditor.selection.moveNextPosition();
      break;
    case "copy":
      editor.documentEditor.focusIn();
      editor.documentEditor.selection.selectAll();
      editor.documentEditor.selection.copy();
      editor.documentEditor.selection.moveNextPosition();
      break;
    case "Paste":
      editor.documentEditor.focusIn();
      editor.documentEditor.enableLocalPaste = true;
      editor.documentEditor.editor.paste();
      editor.documentEditor.enableLocalPaste = false;
      break;
    case "ChangeCase":
      editor.documentEditor.selection.characterFormat.allCaps =
        !editor.documentEditor.selection.characterFormat.allCaps;
      break;
    case "bold":
      //Toggles the bold of selected content
      editor.documentEditor.editor.toggleBold();
      break;
    case "italic":
      //Toggles the Italic of selected content
      editor.documentEditor.editor.toggleItalic();
      break;
    case "underline":
      //Toggles the underline of selected content
      editor.documentEditor.editor.toggleUnderline("Single");
      break;
    case "strikethrough":
      //Toggles the strikethrough of selected content
      editor.documentEditor.editor.toggleStrikethrough();
      break;
    case "subscript":
      //Toggles the subscript of selected content
      editor.documentEditor.editor.toggleSubscript();
      break;
    case "superscript":
      //Toggles the superscript of selected content
      editor.documentEditor.editor.toggleSuperscript();
      break;
    case "AlignLeft":
      //Toggle the Left alignment for selected or current paragraph
      editor.documentEditor.editor.toggleTextAlignment("Left");
      break;
    case "AlignRight":
      //Toggle the Right alignment for selected or current paragraph
      editor.documentEditor.editor.toggleTextAlignment("Right");
      break;
    case "AlignCenter":
      //Toggle the Center alignment for selected or current paragraph
      editor.documentEditor.editor.toggleTextAlignment("Center");
      break;
    case "Justify":
      //Toggle the Justify alignment for selected or current paragraph
      editor.documentEditor.editor.toggleTextAlignment("Justify");
      break;
    case "IncreaseIndent":
      //Increase the left indent of selected or current paragraph
      editor.documentEditor.editor.increaseIndent();
      break;
    case "DecreaseIndent":
      //Decrease the left indent of selected or current paragraph
      editor.documentEditor.editor.decreaseIndent();
      break;
    case "ClearFormat":
      //Clear all formattiing of the selected paragraph or content.
      editor.documentEditor.editor.clearFormatting();
      break;
    case "Bullets":
      //To create bullet list
      editor.documentEditor.editor.applyBullet("\uf0b7", "Symbol");
      break;
    case "Numbering":
      //To create numbering list
      editor.documentEditor.editor.applyNumbering("%1)", "UpRoman");
      break;
    case "clearlist":
      //To clear list
      editor.documentEditor.editor.clearList();
      break;
    case "Single":
      editor.documentEditor.selection.paragraphFormat.lineSpacing = 1;
      break;
    case "1.15":
      editor.documentEditor.selection.paragraphFormat.lineSpacing = 1.15;
      break;
    case "1.5":
      editor.documentEditor.selection.paragraphFormat.lineSpacing = 1.5;
      break;
    case "Double":
      editor.documentEditor.selection.paragraphFormat.lineSpacing = 2;
      break;
    case "ShowParagraphMark":
      //Show or hide the hidden characters like spaces, tab, paragraph marks, and breaks.
      editor.documentEditor.documentEditorSettings.showHiddenMarks =
        !editor.documentEditor.documentEditorSettings.showHiddenMarks;
      break;
    default:
      break;
  }
};

export const toolBarSettings = (
  editor: DocumentEditorContainer,
  editorContainerLocale: typeof EJ2_LOCALE["pt-BR"],
  config: IaraSyncfusionConfig
): Ribbon => {
  editor.selectionChange = () => {
    setTimeout(() => {
      onSelectionChange();
    }, 20);
  };
  const ribbonConfig: Ribbon = new Ribbon({
    tabs: tabsConfig(
      editor,
      toolbarButtonClick,
      editorContainerLocale,
      config,
      () => ribbonFontMethods(editor)
    ),
    activeLayout: "Simplified",
    hideLayoutSwitcher: true,
  });

  const onSelectionChange = () => {
    if (editor.documentEditor.selection) {
      const characterFormat = editor.documentEditor.selection.characterFormat;
      ribbonParagraphToggleConfigs(editor);

      getEditorStyleConfig(characterFormat, ribbonConfig, editor);

      enableDisableFontOptions(characterFormat);
    }
  };

  return ribbonConfig;
};

const getEditorStyleConfig = (
  characterFormat: SelectionCharacterFormat,
  ribbon: Ribbon,
  editor: DocumentEditorContainer
) => {
  ribbonFontMethods(editor).changeFontFamily(
    { value: characterFormat.fontFamily },
    ribbon
  );
  ribbonFontMethods(editor).changeFontSize({ value: characterFormat.fontSize });
  ribbonFontMethods(editor).changeFontColor({
    currentValue: { hex: characterFormat.fontColor },
  });
};

const ribbonFontMethods = (
  editor: DocumentEditorContainer
): RibbonFontMethods => {
  //To change the font Style of selected content
  const changeFontFamily = (args: { value: string }, ribbon?: Ribbon) => {
    editor.documentEditor.selection.characterFormat.fontFamily = args.value;
    if (ribbon) {
      ribbon.updateItem({
        id: "fontFamilySelect",
        comboBoxSettings: {
          value: args.value,
        },
      });
    }
    editor.documentEditor.focusIn();
  };
  //To Change the font Size of selected content
  const changeFontSize = (args: { value: number }) => {
    editor.documentEditor.selection.characterFormat.fontSize = args.value;
    editor.documentEditor.focusIn();
  };
  //To Change the font Color of selected content
  const changeFontColor = (args: { currentValue: { hex: string } }) => {
    editor.documentEditor.selection.characterFormat.fontColor =
      args.currentValue.hex;
    editor.documentEditor.focusIn();
  };
  return { changeFontFamily, changeFontSize, changeFontColor };
};

const ribbonParagraphToggleConfigs = (editor: DocumentEditorContainer) => {
  const paragraphFormat = editor.documentEditor.selection.paragraphFormat;
  const toggleBtnIds = [
    "AlignLeft",
    "AlignCenter",
    "AlignRight",
    "Justify",
    "ShowParagraphMark",
  ];
  toggleBtnIds.forEach(toggleBtnId => {
    const toggleBtn = document.getElementById(toggleBtnId);
    //Remove toggle state.
    toggleBtn?.classList.remove("e-btn-toggle");
  });
  //Add toggle state based on selection paragraph format.
  if (paragraphFormat.textAlignment === "Left") {
    document.getElementById("AlignLeft")?.classList.add("e-btn-toggle");
  } else if (paragraphFormat.textAlignment === "Right") {
    document.getElementById("AlignRight")?.classList.add("e-btn-toggle");
  } else if (paragraphFormat.textAlignment === "Center") {
    document.getElementById("AlignCenter")?.classList.add("e-btn-toggle");
  } else {
    document.getElementById("Justify")?.classList.add("e-btn-toggle");
  }
  if (editor.documentEditor.documentEditorSettings.showHiddenMarks) {
    document.getElementById("ShowParagraphMark")?.classList.add("e-btn-toggle");
  }
};

const enableDisableFontOptions = (
  characterformat: SelectionCharacterFormat
) => {
  const properties = [
    characterformat.bold,
    characterformat.italic,
    characterformat.underline,
    characterformat.strikethrough,
  ];

  const toggleBtnId = [
    "ribbon_tab0_group11_collection15_item16",
    "ribbon_tab0_group11_collection15_item17",
    "ribbon_tab0_group11_collection15_item18",
    "ribbon_tab0_group11_collection15_item19",
    "ribbon_tab0_group11_collection15_item20",
  ];

  for (let i = 0; i < properties.length; i++) {
    changeActiveState(properties[i], toggleBtnId[i]);
  }
};

const changeActiveState = (property: string | boolean, btnId: string) => {
  const toggleBtn: HTMLElement | null = document.getElementById(btnId);
  if (
    (typeof property == "boolean" && property) ||
    (typeof property == "string" && property !== "None")
  )
    toggleBtn?.classList.add("e-active");
  else if (toggleBtn?.classList.contains("e-active")) {
    toggleBtn.classList.remove("e-active");
  }
};
