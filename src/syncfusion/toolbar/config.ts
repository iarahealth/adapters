import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import * as EJ2_LOCALE from "@syncfusion/ej2-locale/src/pt-BR.json";
import {
  DisplayMode,
  Ribbon,
  RibbonColorPicker,
  RibbonFileMenu,
  RibbonGroupButtonSelection,
  RibbonItemSize,
} from "@syncfusion/ej2-ribbon";

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
  editorContainerLocale: typeof EJ2_LOCALE["pt-BR"]
): Ribbon => {
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
    const toggleBtnId = [
      "ribbon_tab0_group11_collection15_item17",
      "ribbon_tab0_group11_collection15_item18",
      "ribbon_tab0_group11_collection15_item19",
      "ribbon_tab0_group11_collection15_item20",
      "ribbon_tab0_group11_collection15_item21",
    ];
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
      toggleBtn?.classList.add("e-active");
    else if (toggleBtn?.classList.contains("e-active")) {
      toggleBtn.classList.remove("e-active");
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

  const tabs = [
    {
      groups: [
        {
          collections: [
            {
              items: [
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    content: "Undo",
                    isToggle: true,
                    iconCss: "e-icons e-undo",
                    clicked: function () {
                      toolbarButtonClick("undo", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.documenteditorcontainer[
                        "Undo Tooltip"
                      ],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    content: "Redo",
                    isToggle: true,
                    iconCss: "e-icons e-redo",
                    clicked: function () {
                      toolbarButtonClick("redo", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.documenteditorcontainer[
                        "Redo Tooltip"
                      ],
                  },
                },
              ],
            },
          ],
        },
        {
          header: "Clipboard",
          id: "clipboard",
          showLauncherIcon: true,
          groupIconCss: "e-icons e-paste",
          collections: [
            {
              items: [
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Large,
                  buttonSettings: {
                    iconCss: "e-icons e-paste",
                    content: "Colar",
                    clicked: function () {
                      toolbarButtonClick("Paste", editor);
                    },
                  },
                },
              ],
            },
            {
              items: [
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    iconCss: "e-icons e-cut",
                    content: "Cut",
                    clicked: function () {
                      toolbarButtonClick("cut", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title: editorContainerLocale.filemanager["Tooltip-Cut"],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    iconCss: "e-icons e-copy",
                    content: "Copy",
                    clicked: function () {
                      toolbarButtonClick("copy", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title: editorContainerLocale.filemanager["Tooltip-Copy"],
                  },
                },
              ],
            },
          ],
        },
        {
          header: "Font",
          groupIconCss: "e-icons e-bold",
          cssClass: "font-group",
          enableGroupOverflow: true,
          overflowHeader: "More Font Options",
          orientation: "Row",
          collections: [
            {
              items: [
                {
                  type: "ComboBox",
                  comboBoxSettings: {
                    dataSource: fontStyle,
                    label: "Font Style",
                    width: "115px",
                    popupWidth: "150px",
                    index: 3,
                    value: editor.documentEditor.selection.characterFormat.fontFamily,
                    allowFiltering: true,
                    change: function (args: { itemData: { text: string } }) {
                      if (args.itemData) {
                        changeFontFamily({ value: args.itemData.text });
                      }
                    },
                  },
                },
                {
                  type: "ComboBox",
                  comboBoxSettings: {
                    dataSource: fontSize,
                    label: "Font Size",
                    popupWidth: "85px",
                    width: "65px",
                    allowFiltering: true,
                    index: 3,
                    value: editor.documentEditor.selection.characterFormat.fontSize + '',
                    change: function (args: { itemData: { text: string } }) {
                      console.log(args.itemData);
                      if (args.itemData) {
                        changeFontSize({ value: Number(args.itemData.text) });
                      }
                    },
                  },
                },
              ],
            },
            {
              items: [
                {
                  type: "ColorPicker",
                  allowedSizes: RibbonItemSize.Small,
                  displayOptions: DisplayMode.Simplified | DisplayMode.Classic,
                  colorPickerSettings: {
                    change: function (args: { currentValue: { hex: string } }) {
                      changeFontColor({
                        currentValue: { hex: args.currentValue.hex },
                      });
                    },
                    value: editor.documentEditor.selection.characterFormat.fontColor ? editor.documentEditor.selection.characterFormat.fontColor : `#000`
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    content: "Bold",
                    isToggle: true,
                    iconCss: "e-icons e-bold",
                    clicked: function () {
                      toolbarButtonClick("bold", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.documenteditorcontainer[
                        "Bold Tooltip"
                      ],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    isToggle: true,
                    content: "Italic",
                    clicked: function () {
                      toolbarButtonClick("italic", editor);
                    },
                    iconCss: "e-icons e-italic",
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.documenteditorcontainer[
                        "Italic Tooltip"
                      ],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    isToggle: true,
                    content: "Underline",
                    clicked: function () {
                      toolbarButtonClick("underline", editor);
                    },
                    iconCss: "e-icons e-underline",
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.documenteditorcontainer[
                        "Underline Tooltip"
                      ],
                  },
                },
                {
                  allowedSizes: RibbonItemSize.Small,
                  type: "Button",
                  buttonSettings: {
                    iconCss: "e-icons e-strikethrough",
                    content: "Strikethrough",
                    isToggle: true,
                    clicked: function () {
                      toolbarButtonClick("strikethrough", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.documenteditorcontainer[
                        "Strikethrough"
                      ],
                  },
                },
                // uppercase button will be implemented
                // {
                //   allowedSizes: RibbonItemSize.Small,
                //   type: "Button",
                //   buttonSettings: {
                //     iconCss: "e-icons e-change-case",
                //     content: "Change Case",
                //     isToggle: true,
                //     clicked: function () {
                //       toolbarButtonClick("ChangeCase", editor);
                //     },
                //   },
                //   ribbonTooltipSettings: {
                //     title:
                //       editorContainerLocale.documenteditorcontainer[
                //         "Change case Tooltip"
                //       ],
                //   },
                // },
              ],
            },
          ],
        },
        {
          id: "paragraph_group",
          orientation: "Row",
          header: "Paragraph",
          groupIconCss: "e-icons e-align-center",
          collections: [
            {
              items: [
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    iconCss: "e-icons e-decrease-indent",
                    content: "Decrease Indent",
                    clicked: function () {
                      toolbarButtonClick("DecreaseIndent", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.documenteditorcontainer[
                        "Decrease indent"
                      ],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    iconCss: "e-icons e-increase-indent",
                    content: "Increase Indent",
                    clicked: function () {
                      toolbarButtonClick("IncreaseIndent", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.documenteditorcontainer[
                        "Increase indent"
                      ],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    iconCss: "e-icons e-paragraph",
                    content: "Paragraph",
                    clicked: function () {
                      toolbarButtonClick("ShowParagraphMark", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.documenteditorcontainer[
                        "Paragraph"
                      ],
                  },
                },
              ],
            },
            {
              items: [
                {
                  type: "GroupButton",
                  allowedSizes: RibbonItemSize.Small,
                  groupButtonSettings: {
                    selection: RibbonGroupButtonSelection.Single,
                    header: "Alignment",
                    items: [
                      {
                        iconCss: "e-icons e-align-left",
                        selected: true,
                        click: function () {
                          toolbarButtonClick("AlignLeft", editor);
                        },
                        ribbonTooltipSettings: {
                          title:
                            editorContainerLocale.documenteditorcontainer[
                              "Align left Tooltip"
                            ],
                        },
                      },
                      {
                        iconCss: "e-icons e-align-center",
                        click: function () {
                          toolbarButtonClick("AlignCenter", editor);
                        },
                        ribbonTooltipSettings: {
                          title:
                            editorContainerLocale.documenteditorcontainer[
                              "Align center"
                            ],
                        },
                      },
                      {
                        iconCss: "e-icons e-align-right",
                        click: function () {
                          toolbarButtonClick("AlignRight", editor);
                        },
                        ribbonTooltipSettings: {
                          title:
                            editorContainerLocale.documenteditorcontainer[
                              "Align right Tooltip"
                            ],
                        },
                      },
                      {
                        iconCss: "e-icons e-justify",
                        click: function () {
                          toolbarButtonClick("Justify", editor);
                        },
                        ribbonTooltipSettings: {
                          title:
                            editorContainerLocale.documenteditorcontainer[
                              "Justify Tooltip"
                            ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const ribbonSettings: Ribbon = new Ribbon({
    tabs: tabs,
    activeLayout: "Simplified",
    hideLayoutSwitcher: true,
  });

  return ribbonSettings;
};
