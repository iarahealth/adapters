import {
  DocumentEditorContainer,
  SelectionCharacterFormat,
} from "@syncfusion/ej2-documenteditor";
import {
  Ribbon,
  RibbonColorPicker,
  RibbonFileMenu,
} from "@syncfusion/ej2-ribbon";
import { IaraSyncfusionConfig } from "..";
import { IaraSFDT } from "../content";
import { IaraLanguages } from "../language/language";
import { IaraSyncfusionNavigationFieldManager } from "../navigationFields";
import { tabsConfig } from "./tabs";

export interface RibbonFontMethods {
  changeFontFamily: (
    args: {
      value: string;
    },
    ribbon?: Ribbon
  ) => void;
  changeFontSize: (args: { value: number }, ribbon?: Ribbon) => void;
  changeFontColor: (
    args: {
      currentValue: {
        hex: string;
      };
    },
    ribbon?: Ribbon
  ) => void;
}

export interface RibbonParagraphMethods {
  changeLineSpacing: (args: { value: number }, ribbon?: Ribbon) => void;
}

Ribbon.Inject(RibbonFileMenu, RibbonColorPicker);

const toolbarOpenFile = (
  arg: string,
  editorContainer: DocumentEditorContainer
): void => {
  switch (arg) {
    case "open": {
      const filePicker = document.createElement("input") as HTMLInputElement;
      filePicker.setAttribute("type", "file");
      filePicker.setAttribute(
        "accept",
        ".doc,.docx,.rtf,.txt,.htm,.html,.sfdt"
      );

      filePicker.onchange = (): void => {
        const file = filePicker.files![0];
        if (!file.name.endsWith(".sfdt")) {
          loadFile(file, editorContainer);
        }
      };

      filePicker.click();
      break;
    }
    case "image": {
      const imagePicker = document.createElement("input") as HTMLInputElement;
      imagePicker.setAttribute("type", "file");
      imagePicker.setAttribute("accept", ".jpg,.jpeg,.png");

      imagePicker.onchange = (): void => {
        const file = imagePicker.files![0];
        onInsertImage(file, editorContainer);
      };

      imagePicker.click();
      break;
    }
  }
};

function loadFile(file: File, editorContainer: DocumentEditorContainer) {
  const formData = new FormData();
  formData.append("files", file);

  fetch(
    "https://services.syncfusion.com/js/production/api/documenteditor/import",
    {
      method: "POST",
      body: formData,
    }
  )
    .then(response => response.text())
    .then(text => editorContainer.documentEditor.open(text));
}

function onInsertImage(
  file: any,
  editorContainer: DocumentEditorContainer
): void {
  if (
    navigator.userAgent.match("Chrome") ||
    navigator.userAgent.match("Firefox") ||
    navigator.userAgent.match("Edge") ||
    navigator.userAgent.match("MSIE") ||
    navigator.userAgent.match(".NET")
  ) {
    if (file) {
      const path = file;
      const reader = new FileReader();
      reader.onload = function (frEvent: any) {
        const base64String = frEvent.target.result;
        const image = document.createElement("img");
        image.addEventListener("load", function () {
          editorContainer.documentEditor.editor.insertImage(
            base64String,
            this.width,
            this.height
          );
        });
        image.src = base64String;
      };
      reader.readAsDataURL(path);
    }
  } else {
    const image = document.createElement("img");
    image.addEventListener("load", function () {
      editorContainer.documentEditor.editor.insertImage(file.target.result);
    });
    image.src = file;
  }
}

const toolbarButtonClick = (
  arg: string,
  editor: DocumentEditorContainer,
  config?: IaraSyncfusionConfig,
  navigationFields?: IaraSyncfusionNavigationFieldManager
): void => {
  const selectedText = editor.documentEditor.selection.text
    ? editor.documentEditor.selection.text.trim()
    : undefined;
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
      editor.documentEditor.editor.applyNumbering("%1)");
      break;
    case "clearlist":
      //To clear list
      editor.documentEditor.editor.clearList();
      break;
    case "insertTable":
      editor.documentEditor.editor.insertTable(2, 2);
      editor.documentEditor.selection.selectTable();
      editor.documentEditor.editor.applyBorders({
        borderColor: editor.documentEditor.characterFormat.fontColor,
        borderStyle: "Single",
        lineWidth: 1,
        type: "AllBorders",
      });
      break;
    case "ExportToPDF":
      IaraSFDT.toPdf(editor, config);
      break;
    case "ShowParagraphMark":
      //Show or hide the hidden characters like spaces, tab, paragraph marks, and breaks.
      editor.documentEditor.documentEditorSettings.showHiddenMarks =
        !editor.documentEditor.documentEditorSettings.showHiddenMarks;
      break;
    case "ToggleTrackChanges":
      editor.documentEditor.enableTrackChanges =
        !editor.documentEditor.enableTrackChanges;
      changeActiveState(
        editor.documentEditor.enableTrackChanges,
        "trackChangesBtn"
      );
      break;
    case "AddField":
      navigationFields?.insertField(selectedText, undefined);
      break;
    case "AddMandatoryField":
      navigationFields?.insertField(selectedText, undefined, "Mandatory");
      break;
    case "AddOptionalField":
      navigationFields?.insertField(selectedText, undefined, "Optional");
      break;
    case "AddAdditiveField":
      navigationFields?.addAdditiveField();
      break;
    case "NextField":
      navigationFields?.nextField();
      break;
    case "PreviousField":
      navigationFields?.previousField();
      break;
    default:
      break;
  }
};

export const toolBarSettings = (
  editor: DocumentEditorContainer,
  navigationFields: IaraSyncfusionNavigationFieldManager,
  editorContainerLocale: IaraLanguages,
  config: IaraSyncfusionConfig
): { ribbon: Ribbon; listener: () => void } => {
  const ribbonMethods = {
    ribbonFontMethods: () => ribbonFontMethods(editor),
    ribbonParagraphMethods: () => ribbonParagraphMethods(editor),
  };

  const navigationFunc = (funcId: string) => {
    if (funcId === "add_field") {
      toolbarButtonClick("AddField", editor, undefined, navigationFields);
    }
    if (funcId === "add_mandatory_field") {
      toolbarButtonClick(
        "AddMandatoryField",
        editor,
        undefined,
        navigationFields
      );
    }
    if (funcId === "add_optional_field") {
      toolbarButtonClick(
        "AddOptionalField",
        editor,
        undefined,
        navigationFields
      );
    }
    if (funcId === "add_additive_field") {
      toolbarButtonClick(
        "AddAdditiveField",
        editor,
        undefined,
        navigationFields
      );
    }
    if (funcId === "next_field") {
      toolbarButtonClick("NextField", editor, undefined, navigationFields);
    }
    if (funcId === "previous_field") {
      toolbarButtonClick("PreviousField", editor, undefined, navigationFields);
    }
  };

  const ribbonConfig: Ribbon = new Ribbon({
    tabs: tabsConfig(
      editor,
      toolbarOpenFile,
      toolbarButtonClick,
      editorContainerLocale,
      config,
      ribbonMethods,
      navigationFunc
    ),
    activeLayout: config.ribbon?.displayMode,
  });

  const onSelectionChange = () => {
    if (editor && editor.documentEditor.selection) {
      const characterFormat = editor.documentEditor.selection.characterFormat;
      ribbonParagraphToggleConfigs(editor);

      getReportStyleConfig(ribbonConfig, editor, config);

      enableDisableFontOptions(characterFormat);
    }
  };
  const listener = onSelectionChange.bind(this);
  addEventListener("SyncfusionOnSelectionChange", listener);
  return { ribbon: ribbonConfig, listener };
};

let hasSetLineSpacing = false;

const getReportStyleConfig = (
  ribbon: Ribbon,
  editor: DocumentEditorContainer,
  config: IaraSyncfusionConfig
) => {
  if (!hasSetLineSpacing && config.contextualParagraphSpacing) {
    editor.documentEditor.selection.paragraphFormat.contextualSpacing =
      config.contextualParagraphSpacing;
    hasSetLineSpacing = true;
  }
  const paragraphFormat = editor.documentEditor.selection.paragraphFormat;
  const characterFormat = editor.documentEditor.selection.characterFormat;

  ribbonFontMethods(editor).changeFontFamily(
    { value: characterFormat.fontFamily },
    ribbon
  );
  ribbonFontMethods(editor).changeFontSize(
    { value: characterFormat.fontSize },
    ribbon
  );
  ribbonFontMethods(editor).changeFontColor(
    {
      currentValue: { hex: characterFormat.fontColor },
    },
    ribbon
  );
  ribbonParagraphMethods(editor).changeLineSpacing(
    {
      value: paragraphFormat.lineSpacing,
    },
    ribbon
  );
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
  };
  //To Change the font Size of selected content
  const changeFontSize = (args: { value: number }, ribbon?: Ribbon) => {
    editor.documentEditor.selection.characterFormat.fontSize = args.value;
    if (ribbon) {
      ribbon.updateItem({
        id: "fontSizeSelect",
        comboBoxSettings: {
          value: String(args.value),
        },
      });
    }
  };
  //To Change the font Color of selected content
  const changeFontColor = (args: { currentValue: { hex: string } }) => {
    editor.documentEditor.selection.characterFormat.fontColor =
      args.currentValue.hex;
  };
  return { changeFontFamily, changeFontSize, changeFontColor };
};

const ribbonParagraphMethods = (
  editor: DocumentEditorContainer
): RibbonParagraphMethods => {
  const changeLineSpacing = (args: { value: number }, ribbon?: Ribbon) => {
    editor.documentEditor.selection.paragraphFormat.lineSpacing = args.value;
    if (ribbon) {
      ribbon.updateItem({
        id: "lineSpacingSelect",
        comboBoxSettings: {
          value: String(args.value),
        },
      });
    }
  };
  return { changeLineSpacing };
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

  const toggleBtnId = ["bold", "italic", "underline", "strikethrough"];

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
