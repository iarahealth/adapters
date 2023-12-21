import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import * as EJ2_LOCALE from "@syncfusion/ej2-locale/src/pt-BR.json";
import { ComboBox } from "@syncfusion/ej2-dropdowns";
import { ColorPicker } from "@syncfusion/ej2-inputs";

export const toolbarButtonClick = (
  arg: { item: { id: string } },
  editor: DocumentEditorContainer
): void => {
  switch (arg.item.id) {
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
  editorContainerLocale: typeof EJ2_LOCALE["pt-BR"]["documenteditorcontainer"]
): Record<string, unknown>[] => {
  //To change the font Style of selected content
  const changeFontFamily = (args: { value: string }) => {
    editor.documentEditor.selection.characterFormat.fontFamily = args.value;
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
  editor.selectionChange = () => {
    setTimeout(() => {
      onSelectionChange();
    }, 20);
  };
  //Selection change to retrieve formatting
  const onSelectionChange = () => {
    if (editor.documentEditor.selection) {
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
        document
          .getElementById("ShowParagraphMark")
          ?.classList.add("e-btn-toggle");
      }
      enableDisableFontOptions();
    }
  };
  const enableDisableFontOptions = () => {
    const characterformat = editor.documentEditor.selection.characterFormat;
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
  function changeActiveState(property: string | boolean, btnId: string) {
    const toggleBtn: HTMLElement | null = document.getElementById(btnId);
    if (
      (typeof property == "boolean" && property) ||
      (typeof property == "string" && property !== "None")
    )
      toggleBtn?.classList.add("e-btn-toggle");
    else if (toggleBtn?.classList.contains("e-btn-toggle")) {
      toggleBtn.classList.remove("e-btn-toggle");
    }
  }
  const fontStyle: string[] = [
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
  const fontSize: string[] = [
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
      tooltipText: editorContainerLocale["Bold Tooltip"],
      id: "bold",
    },
    {
      type: "Button",
      prefixIcon: "e-de-ctnr-italic e-icons",
      tooltipText: editorContainerLocale["Italic Tooltip"],
      id: "italic",
    },
    {
      type: "Button",
      prefixIcon: "e-de-ctnr-underline e-icons",
      tooltipText: editorContainerLocale["Underline Tooltip"],
      id: "underline",
    },
    {
      type: "Button",
      prefixIcon: "e-de-ctnr-strikethrough e-icons",
      tooltipText: editorContainerLocale["Strikethrough"],
      id: "strikethrough",
    },
    {
      type: "Button",
      prefixIcon: "e-de-ctnr-subscript e-icons",
      tooltipText: editorContainerLocale["Subscript Tooltip"],
      id: "subscript",
    },
    {
      type: "Button",
      prefixIcon: "e-de-ctnr-superscript e-icons",
      tooltipText: editorContainerLocale["Superscript Tooltip"],
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
      tooltipText: editorContainerLocale["Align left Tooltip"],
      id: "AlignLeft",
    },
    {
      prefixIcon: "e-de-ctnr-aligncenter e-icons",
      tooltipText: editorContainerLocale["Align center"],
      id: "AlignCenter",
    },
    {
      prefixIcon: "e-de-ctnr-alignright e-icons",
      tooltipText: editorContainerLocale["Align right Tooltip"],
      id: "AlignRight",
    },
    {
      prefixIcon: "e-de-ctnr-justify e-icons",
      tooltipText: editorContainerLocale["Justify Tooltip"],
      id: "Justify",
    },
    {
      prefixIcon: "e-de-ctnr-increaseindent e-icons",
      tooltipText: editorContainerLocale["Increase indent"],
      id: "IncreaseIndent",
    },
    {
      prefixIcon: "e-de-ctnr-decreaseindent e-icons",
      tooltipText: editorContainerLocale["Decrease indent"],
      id: "DecreaseIndent",
    },
    { type: "Separator" },
    {
      prefixIcon: "e-de-ctnr-bullets e-icons",
      tooltipText: editorContainerLocale["Bullets"],
      id: "Bullets",
    },
    {
      prefixIcon: "e-de-ctnr-numbering e-icons",
      tooltipText: editorContainerLocale["Numbering"],
      id: "Numbering",
    },
    {
      prefixIcon: "e-de-e-paragraph-mark e-icons",
      tooltipText: editorContainerLocale["Paragraph"],
      id: "ShowParagraphMark",
    },
    {
      prefixIcon: "e-de-ctnr-clearall e-icons",
      tooltipText: editorContainerLocale["Clear all formatting"],
      id: "ClearFormat",
    },
  ];

  return addItemsToolbar;
};
