import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import { ComboBox } from "@syncfusion/ej2-dropdowns";
import { ColorPicker } from "@syncfusion/ej2-inputs";
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
      editor.documentEditor.editor.cut();
      break;
    case "copy":
      editor.documentEditor.selection.copy();
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
  editorContainerLocale: typeof EJ2_LOCALE["pt-BR"]["documenteditorcontainer"]
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

  // const tabs: RibbonTabModel[] = [
  //   {
  //     header: "Home",
  //     groups: [
  //       {
  //         header: "Clipboard",
  //         collections: [
  //           {
  //             items: [
  //               {
  //                 type: RibbonItemType.SplitButton,
  //                 allowedSizes: RibbonItemSize.Small,
  //                 splitButtonSettings: {
  //                   iconCss: "e-icons e-paste",
  //                   items: [
  //                     { text: "Keep Source Format" },
  //                     { text: "Merge format" },
  //                     { text: "Keep text only" },
  //                   ],
  //                   content: "Paste",
  //                 },
  //               },
  //             ],
  //           },
  //           {
  //             items: [
  //               {
  //                 type: RibbonItemType.Button,
  //                 buttonSettings: {
  //                   content: "Cut",
  //                   iconCss: "e-icons e-cut",
  //                 },
  //               },
  //               {
  //                 type: RibbonItemType.Button,
  //                 buttonSettings: {
  //                   content: "Copy",
  //                   iconCss: "e-icons e-copy",
  //                 },
  //               },
  //               {
  //                 type: RibbonItemType.Button,
  //                 buttonSettings: {
  //                   content: "Format Painter",
  //                   iconCss: "e-icons e-format-painter",
  //                 },
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         header: "Font",
  //         orientation: ItemOrientation.Row,
  //         collections: [
  //           {
  //             items: [
  //               {
  //                 type: RibbonItemType.ComboBox,
  //                 comboBoxSettings: {
  //                   dataSource: fontStyle,
  //                   index: 3,
  //                   allowFiltering: true,
  //                   width: "150px",
  //                 },
  //               },
  //               {
  //                 type: RibbonItemType.ComboBox,
  //                 comboBoxSettings: {
  //                   dataSource: fontSize,
  //                   index: 3,
  //                   width: "65px",
  //                 },
  //               },
  //             ],
  //           },
  //           {
  //             items: [
  //               {
  //                 type: RibbonItemType.Button,
  //                 buttonSettings: {
  //                   content: "Bold",
  //                   iconCss: "e-icons e-bold",
  //                   clicked: args => toolbarButtonClick(args, editor),
  //                 },
  //               },
  //               {
  //                 type: RibbonItemType.Button,
  //                 buttonSettings: {
  //                   content: "Italic",
  //                   iconCss: "e-icons e-italic",
  //                 },
  //               },
  //               {
  //                 type: RibbonItemType.Button,
  //                 buttonSettings: {
  //                   content: "Underline",
  //                   iconCss: "e-icons e-underline",
  //                 },
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];

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
                  id: "pastebtn",
                  type: "SplitButton",
                  allowedSizes: RibbonItemSize.Large,
                  disabled: true,
                  splitButtonSettings: {
                    iconCss: "e-icons e-paste",
                    items: [
                      { text: "Manter formato da fonte" },
                      { text: "Mesclar formato de texto" },
                      { text: "Manter apenas texto" },
                    ],
                    content: "Paste",
                    click: function () {
                      updateContent("Paste");
                    },
                    select: function (args: { item: { text: string } }) {
                      updateContent("Paste -> " + args.item.text);
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
                      enablePaste();
                    },
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
                      enablePaste();
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
                    iconCss: "e-icons e-format-painter",
                    content: "Format Painter",
                    clicked: function () {
                      updateContent("Format Painter");
                    },
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
                    change: function (args: { itemData: { text: string } }) {
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
                    value: "#000",
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
                },
                {
                  allowedSizes: RibbonItemSize.Small,
                  type: "Button",
                  buttonSettings: {
                    iconCss: "e-icons e-change-case",
                    content: "Change Case",
                    isToggle: true,
                    clicked: function () {
                      updateContent("Change Case");
                    },
                  },
                },
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
                      },
                      {
                        iconCss: "e-icons e-align-center",
                        click: function () {
                          toolbarButtonClick("AlignCenter", editor);
                        },
                      },
                      {
                        iconCss: "e-icons e-align-right",
                        click: function () {
                          toolbarButtonClick("AlignRight", editor);
                        },
                      },
                      {
                        iconCss: "e-icons e-justify",
                        click: function () {
                          toolbarButtonClick("Justify", editor);
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
    // {
    //   id: "insertTab",
    //   header: "Insert",
    //   groups: [
    //     {
    //       id: "table",
    //       header: "Tables",
    //       isCollapsible: false,
    //       collections: [
    //         {
    //           items: [
    //             {
    //               type: "DropDown",
    //               id: "table_item",
    //               allowedSizes: RibbonItemSize.Large,
    //               dropDownSettings: {
    //                 content: "Table",
    //                 iconCss: "e-icons e-table",
    //                 items: [
    //                   { text: "Insert Table" },
    //                   { text: "Draw Table" },
    //                   { text: "Convert Table" },
    //                   { text: "Excel Spreadsheet" },
    //                 ],
    //                 select: function (args: { item: { text: string } }) {
    //                   updateContent("Table -> " + args.item.text);
    //                 },
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       id: "illustration",
    //       header: "Illustrations",
    //       enableGroupOverflow: true,
    //       overflowHeader: "Illustrations",
    //       showLauncherIcon: true,
    //       orientation: "Row",
    //       groupIconCss: "e-icons e-image",
    //       collections: [
    //         {
    //           items: [
    //             {
    //               type: "DropDown",
    //               id: "pictureddl",
    //               dropDownSettings: {
    //                 content: "Pictures",
    //                 target: "#pictureList",
    //                 iconCss: "e-icons e-image",
    //               },
    //             },
    //             {
    //               id: "shapes_item",
    //               type: "DropDown",
    //               dropDownSettings: {
    //                 iconCss: "sf-icon-shapes",
    //                 content: "Shapes",
    //                 items: [
    //                   { text: "Lines" },
    //                   { text: "Rectangles" },
    //                   { text: "Basic Arrows" },
    //                   { text: "Basic Shapes" },
    //                   { text: "FlowChart" },
    //                 ],
    //                 select: function (args: { item: { text: string } }) {
    //                   updateContent("Shapes -> " + args.item.text);
    //                 },
    //               },
    //             },
    //             {
    //               type: "Button",
    //               buttonSettings: {
    //                 iconCss: "sf-icon-3d-model",
    //                 content: "3D Models",
    //                 clicked: function () {
    //                   updateContent("3D Models");
    //                 },
    //               },
    //             },
    //             {
    //               type: "Button",
    //               buttonSettings: {
    //                 content: "SmartArt",
    //                 iconCss: "sf-icon-smart-art",
    //                 clicked: function () {
    //                   updateContent("SmartArt");
    //                 },
    //               },
    //             },
    //             {
    //               type: "Button",
    //               buttonSettings: {
    //                 content: "Chart",
    //                 iconCss: "sf-icon-chart",
    //                 clicked: function () {
    //                   updateContent("Chart");
    //                 },
    //               },
    //             },
    //             {
    //               type: "Button",
    //               buttonSettings: {
    //                 content: "Screenshot",
    //                 iconCss: "sf-icon-screenshot",
    //                 clicked: function () {
    //                   updateContent("Screenshot");
    //                 },
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       id: "header_footer",
    //       header: "Header & Footer",
    //       showLauncherIcon: true,
    //       groupIconCss: "e-icons e-table",
    //       orientation: "Column",
    //       collections: [
    //         {
    //           items: [
    //             {
    //               type: "DropDown",
    //               dropDownSettings: {
    //                 content: "Header",
    //                 iconCss: "e-icons e-header",
    //                 items: [
    //                   { text: "Insert Header" },
    //                   { text: "Edit Header" },
    //                   { text: "Remove Header" },
    //                 ],
    //                 select: function (args: { item: { text: string } }) {
    //                   updateContent("Header -> " + args.item.text);
    //                 },
    //               },
    //             },
    //             {
    //               type: "DropDown",
    //               dropDownSettings: {
    //                 content: "Footer",
    //                 iconCss: "e-icons e-footer",
    //                 items: [
    //                   { text: "Insert Footer" },
    //                   { text: "Edit Footer" },
    //                   { text: "Remove Footer" },
    //                 ],
    //                 select: function (args: { item: { text: string } }) {
    //                   updateContent("Footer -> " + args.item.text);
    //                 },
    //               },
    //             },
    //             {
    //               id: "page_item",
    //               type: "DropDown",
    //               dropDownSettings: {
    //                 content: "Page Number",
    //                 iconCss: "e-icons e-page-numbering",
    //                 items: [
    //                   { text: "Insert Top of page" },
    //                   { text: "Insert Bottom of page" },
    //                   { text: "Format Page Number" },
    //                   { text: "Remove Page Number" },
    //                 ],
    //                 select: function (args: { item: { text: string } }) {
    //                   updateContent("Page Numbering -> " + args.item.text);
    //                 },
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       id: "comments_tab",
    //       isCollapsible: false,
    //       header: "Comments",
    //       collections: [
    //         {
    //           items: [
    //             {
    //               id: "new_cmnt_item",
    //               type: "Button",
    //               allowedSizes: RibbonItemSize.Large,
    //               buttonSettings: {
    //                 iconCss: "e-icons e-comment-add",
    //                 content: "New Comment",
    //                 clicked: function () {
    //                   updateContent("New Comment");
    //                 },
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       id: "linkGroup",
    //       header: "Links",
    //       groupIconCss: "e-icons e-link",
    //       collections: [
    //         {
    //           items: [
    //             {
    //               allowedSizes: RibbonItemSize.Large,
    //               type: "DropDown",
    //               id: "link_item",
    //               dropDownSettings: {
    //                 content: "Link",
    //                 iconCss: "e-icons e-link",
    //                 items: [
    //                   { text: "Insert Link", iconCss: "e-icons e-link" },
    //                   { text: "Recent Links", iconCss: "e-icons e-clock" },
    //                   { text: "Bookmarks", iconCss: "e-icons e-bookmark" },
    //                 ],
    //                 select: function (args: { item: { text: string } }) {
    //                   updateContent("Link -> " + args.item.text);
    //                 },
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   id: "view",
    //   header: "View",
    //   groups: [
    //     {
    //       header: "Views",
    //       orientation: "Row",
    //       groupIconCss: "e-icons e-print",
    //       collections: [
    //         {
    //           items: [
    //             {
    //               type: "Button",
    //               buttonSettings: {
    //                 iconCss: "sf-icon-read",
    //                 content: "Read Mode",
    //                 clicked: function () {
    //                   updateContent("Read Mode");
    //                 },
    //               },
    //             },
    //             {
    //               type: "Button",
    //               buttonSettings: {
    //                 content: "Print Layout",
    //                 iconCss: "e-print e-icons",
    //                 clicked: function () {
    //                   updateContent("Print Layout");
    //                 },
    //               },
    //             },
    //             {
    //               type: "Button",
    //               buttonSettings: {
    //                 iconCss: "sf-icon-web-layout",
    //                 content: "Web Layout",
    //                 clicked: function () {
    //                   updateContent("Web Layout");
    //                 },
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       header: "Zoom",
    //       groupIconCss: "e-icons e-zoom-to-fit",
    //       orientation: "Row",
    //       collections: [
    //         {
    //           items: [
    //             {
    //               type: "Button",
    //               buttonSettings: {
    //                 iconCss: "e-icons e-zoom-in",
    //                 content: "Zoom In",
    //                 clicked: function () {
    //                   updateContent("Zoom In");
    //                 },
    //               },
    //             },
    //             {
    //               type: "Button",
    //               buttonSettings: {
    //                 iconCss: "e-icons e-zoom-out",
    //                 content: "Zoom Out",
    //                 clicked: function () {
    //                   updateContent("Zoom Out");
    //                 },
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       header: "Show",
    //       isCollapsible: false,
    //       collections: [
    //         {
    //           items: [
    //             {
    //               type: "CheckBox",
    //               checkBoxSettings: {
    //                 label: "Ruler",
    //                 checked: false,
    //                 change: function () {
    //                   updateContent("Ruler");
    //                 },
    //               },
    //             },
    //             {
    //               id: "gridline",
    //               type: "CheckBox",
    //               checkBoxSettings: {
    //                 checked: false,
    //                 label: "Gridlines",
    //                 change: function () {
    //                   updateContent("Gridlines");
    //                 },
    //               },
    //             },
    //             {
    //               id: "nav_pane",
    //               type: "CheckBox",
    //               checkBoxSettings: {
    //                 label: "Navigation Pane",
    //                 checked: true,
    //                 change: function () {
    //                   updateContent("Navigation Pane");
    //                 },
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       id: "darkmode_group",
    //       header: "Dark Mode",
    //       collections: [
    //         {
    //           items: [
    //             {
    //               id: "darkmode_item",
    //               type: "Button",
    //               allowedSizes: RibbonItemSize.Large,
    //               buttonSettings: {
    //                 iconCss: "sf-icon-mode",
    //                 content: "Dark Mode",
    //                 clicked: function () {
    //                   updateContent("Dark Mode");
    //                 },
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },
  ];

  function updateContent(args: string) {
    console.log(args);
  }

  const ribbonSettings: Ribbon = new Ribbon({
    tabs: tabs,
    activeLayout: "Simplified",
  });

  let isPasteDisabled = true;
  function enablePaste() {
    if (!isPasteDisabled) {
      return;
    }
    ribbonSettings.enableItem("pastebtn");
    isPasteDisabled = false;
  }

  return ribbonSettings;

  // return addItemsToolbar;
};
