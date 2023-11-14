import {
  DocumentEditorContainer,
  Editor,
} from "@syncfusion/ej2-documenteditor";
import { ComboBox } from "@syncfusion/ej2-dropdowns";
import { ColorPicker } from "@syncfusion/ej2-inputs";
import { ItemModel } from "@syncfusion/ej2-splitbuttons";

export const toolbarButtonClick = (
  arg: { item: any },
  editorAPI: Editor,
  editor: DocumentEditorContainer
) => {
  switch (arg.item.id) {
    case "bold":
      //Toggles the bold of selected content
      editorAPI.toggleBold();
      break;
    case "italic":
      //Toggles the Italic of selected content
      editorAPI.toggleItalic();
      break;
    case "underline":
      //Toggles the underline of selected content
      editorAPI.toggleUnderline("Single");
      break;
    case "strikethrough":
      //Toggles the strikethrough of selected content
      editorAPI.toggleStrikethrough();
      break;
    case "subscript":
      //Toggles the subscript of selected content
      editorAPI.toggleSubscript();
      break;
    case "superscript":
      //Toggles the superscript of selected content
      editorAPI.toggleSuperscript();
      break;
    case "AlignLeft":
      //Toggle the Left alignment for selected or current paragraph
      editorAPI.toggleTextAlignment("Left");
      break;
    case "AlignRight":
      //Toggle the Right alignment for selected or current paragraph
      editorAPI.toggleTextAlignment("Right");
      break;
    case "AlignCenter":
      //Toggle the Center alignment for selected or current paragraph
      editorAPI.toggleTextAlignment("Center");
      break;
    case "Justify":
      //Toggle the Justify alignment for selected or current paragraph
      editorAPI.toggleTextAlignment("Justify");
      break;
    case "IncreaseIndent":
      //Increase the left indent of selected or current paragraph
      editorAPI.increaseIndent();
      break;
    case "DecreaseIndent":
      //Decrease the left indent of selected or current paragraph
      editorAPI.decreaseIndent();
      break;
    case "ClearFormat":
      //Clear all formattiing of the selected paragraph or content.
      editorAPI.clearFormatting();
      break;
    case "Bullets":
      //To create bullet list
      editorAPI.applyBullet("\uf0b7", "Symbol");
      break;
    case "Numbering":
      //To create numbering list
      editorAPI.applyNumbering("%1)", "UpRoman");
      break;
    case "clearlist":
      //To clear list
      editorAPI.clearList();
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
    default:
      break;
  }
};

export const toolBarSettings = (editor: DocumentEditorContainer) => {
  //To change the font Style of selected content
  const changeFontFamily = (args: { value: any }) => {
    editor.documentEditor.selection.characterFormat.fontFamily = args.value;
    editor.documentEditor.focusIn();
  };
  //To Change the font Size of selected content
  const changeFontSize = (args: { value: any }) => {
    editor.documentEditor.selection.characterFormat.fontSize = args.value;
    editor.documentEditor.focusIn();
  };
  //To Change the font Color of selected content
  const changeFontColor = (args: { currentValue: { hex: any } }) => {
    editor.documentEditor.selection.characterFormat.fontColor =
      args.currentValue.hex;
    editor.documentEditor.focusIn();
  };
  editor.selectionChange = () => {
    setTimeout(() => {
      onSelectionChange();
    }, 20);
  };
  //Selection change to retrieve formatting
  const onSelectionChange = () => {
    if (editor.documentEditor.selection) {
      var paragraphFormat = editor.documentEditor.selection.paragraphFormat;
      var toggleBtnId = [
        "AlignLeft",
        "AlignCenter",
        "AlignRight",
        "Justify",
        "ShowParagraphMark",
      ];
      for (let i = 0; i < toggleBtnId.length; i++) {
        let toggleBtn = document.getElementById(toggleBtnId[i]);
        //Remove toggle state.
        toggleBtn?.classList.remove("e-btn-toggle");
      }
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
        document
          .getElementById("ShowParagraphMark")
          ?.classList.add("e-btn-toggle");
      }
      enableDisableFontOptions();
    }
  };
  const enableDisableFontOptions = () => {
    var characterformat = editor.documentEditor.selection.characterFormat;
    var properties = [
      characterformat.bold,
      characterformat.italic,
      characterformat.underline,
      characterformat.strikethrough,
    ];
    var toggleBtnId = ["bold", "italic", "underline", "strikethrough"];
    for (var i = 0; i < properties.length; i++) {
      changeActiveState(properties[i], toggleBtnId[i]);
    }
  };
  function changeActiveState(property: string | boolean, btnId: string) {
    let toggleBtn: HTMLElement | null = document.getElementById(btnId);
    if (
      (typeof property == "boolean" && property == true) ||
      (typeof property == "string" && property !== "None")
    )
      toggleBtn?.classList.add("e-btn-toggle");
    else {
      if (toggleBtn?.classList.contains("e-btn-toggle"))
        toggleBtn.classList.remove("e-btn-toggle");
    }
  }
  let fontStyle: string[] = [
    "Algerian",
    "Arial",
    "Calibri",
    "Cambria",
    "Cambria Math",
    "Candara",
    "Courier New",
    "Georgia",
    "Impact",
    "Segoe Print",
    "Segoe Script",
    "Segoe UI",
    "Symbol",
    "Times New Roman",
    "Verdana",
    "Windings",
  ];
  let fontSize: string[] = [
    "8",
    "9",
    "10",
    "11",
    "12",
    "14",
    "16",
    "18",
    "20",
    "22",
    "24",
    "26",
    "28",
    "36",
    "48",
    "72",
    "96",
  ];

  function lineSpacingAction(args: { item: { text: any } }) {
    var text = args.item.text;
    switch (text) {
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
    }
    setTimeout(function () {
      editor.documentEditor.focusIn();
    }, 30);
  }

  const items: ItemModel[] = [
    {
      text: "Single",
    },
    {
      text: "1.15",
    },
    {
      text: "1.5",
    },
    {
      text: "Double",
    },
  ];

  const addItemsToolbar = [
    { type: "Separator" },
    {
      type: "Input",
      template: new ComboBox({
        dataSource: fontStyle,
        width: 120,
        index: 2,
        allowCustom: true,
        change: changeFontFamily,
        autofill: true,
        showClearButton: false,
      }),
    },
    { type: "Separator" },
    {
      type: "Input",
      template: new ComboBox({
        dataSource: fontSize,
        width: 80,
        allowCustom: true,
        index: 2,
        change: changeFontSize,
        showClearButton: false,
      }),
    },
    { type: "Separator" },
    {
      type: "Button",
      prefixIcon: "e-de-ctnr-bold e-icons",
      tooltipText: "Bold",
      id: "bold",
    },
    {
      type: "Button",
      prefixIcon: "e-de-ctnr-italic e-icons",
      tooltipText: "Italic",
      id: "italic",
    },
    {
      type: "Button",
      prefixIcon: "e-de-ctnr-underline e-icons",
      tooltipText: "Underline",
      id: "underline",
    },
    {
      type: "Button",
      prefixIcon: "e-de-ctnr-strikethrough e-icons",
      tooltipText: "Strikethrough",
      id: "strikethrough",
    },
    {
      type: "Button",
      prefixIcon: "e-de-ctnr-subscript e-icons",
      tooltipText: "Subscript",
      id: "subscript",
    },
    {
      type: "Button",
      prefixIcon: "e-de-ctnr-superscript e-icons",
      tooltipText: "Superscript",
      id: "superscript",
    },
    { type: "Separator" },
    {
      type: "Input",
      prefixIcon: "e-color-icon tb-icons",
      template: new ColorPicker({
        value: "#000000",
        showButtons: true,
        change: changeFontColor,
      }),
    },

    { type: "Separator" },
    {
      prefixIcon: "e-de-ctnr-alignleft e-icons",
      tooltipText: "Align Left",
      id: "AlignLeft",
    },
    {
      prefixIcon: "e-de-ctnr-aligncenter e-icons",
      tooltipText: "Align Center",
      id: "AlignCenter",
    },
    {
      prefixIcon: "e-de-ctnr-alignright e-icons",
      tooltipText: "Align Right",
      id: "AlignRight",
    },
    {
      prefixIcon: "e-de-ctnr-justify e-icons",
      tooltipText: "Justify",
      id: "Justify",
    },
    {
      prefixIcon: "e-de-ctnr-increaseindent e-icons",
      tooltipText: "Increase Indent",
      id: "IncreaseIndent",
    },
    {
      prefixIcon: "e-de-ctnr-decreaseindent e-icons",
      tooltipText: "Decrease Indent",
      id: "DecreaseIndent",
    },
    { type: "Separator" },
    {
      prefixIcon: "e-de-e-paragraph-mark e-icons",
      tooltipText:
        "Show the hidden characters like spaces, tab, paragraph marks, and breaks.(Ctrl + *)",
      id: "ShowParagraphMark",
    },
    {
      prefixIcon: "e-de-ctnr-clearall e-icons",
      tooltipText: "ClearFormatting",
      id: "ClearFormat",
    },
    { type: "Separator" },
    {
      prefixIcon: "e-de-ctnr-bullets e-icons",
      tooltipText: "Bullets",
      id: "Bullets",
    },
    {
      prefixIcon: "e-de-ctnr-numbering e-icons",
      tooltipText: "Numbering",
      id: "Numbering",
    },
    {
      text: "Clear",
      id: "clearlist",
      tooltipText: "Clear List",
    },
  ];

  return addItemsToolbar;
};
