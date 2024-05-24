import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";

import {
  DisplayMode,
  RibbonGroupButtonSelection,
  RibbonItemSize,
  RibbonTabModel,
} from "@syncfusion/ej2-ribbon";
import { IaraSyncfusionConfig } from "..";
import { RibbonFontMethods, RibbonParagraphMethods } from "./config";
import { IaraLanguages } from "../language/language";
import { Paragraph } from "@syncfusion/ej2-documenteditor/src/document-editor-container/properties-pane/paragraph-properties";

export const tabsConfig = (
  editor: DocumentEditorContainer,
  toolbarOpenFile: (arg: string, editor: DocumentEditorContainer) => void,
  toolbarButtonClick: (
    arg: string,
    editor: DocumentEditorContainer,
    config?: IaraSyncfusionConfig
  ) => void,
  editorContainerLocale: IaraLanguages,
  config: IaraSyncfusionConfig,
  ribbonMethods: {
    ribbonFontMethods: (editor: DocumentEditorContainer) => RibbonFontMethods;
    ribbonParagraphMethods: (
      editor: DocumentEditorContainer
    ) => RibbonParagraphMethods;
  }
): RibbonTabModel[] => {
  const { changeFontColor, changeFontSize, changeFontFamily } =
    ribbonMethods.ribbonFontMethods(editor);
  const { changeLineSpacing } = ribbonMethods.ribbonParagraphMethods(editor);


  const collection = [
    {
      File: [
        {
          items: [
            {
              type: "Button",
              buttonSettings: {
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Open"],
                isToggle: true,
                iconCss: "e-icons e-folder-open",
                clicked: function () {
                  toolbarOpenFile("open", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .PdfViewer["Open"],
              },
            }
          ]
        }
      ],
      Clipboard: [
        {
          items: [
            {
              //Undo
              type: "Button",
              buttonSettings: {
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Undo"],
                isToggle: true,
                iconCss: "e-icons e-undo",
                clicked: function () {
                  toolbarButtonClick("undo", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Undo Tooltip"],
              }
            },
            {
              //Redo
              type: "Button",
              buttonSettings: {
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Redo"],
                isToggle: true,
                iconCss: "e-icons e-redo",
                clicked: function () {
                  toolbarButtonClick("redo", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Redo Tooltip"],
              }
            },
            {
              //Copy
              type: "Button",
              buttonSettings: {
                iconCss: "e-icons e-copy",
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .filemanager["Tooltip-Copy"],
                clicked: function () {
                  toolbarButtonClick("copy", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .filemanager["Tooltip-Copy"],
              },
            },
            {
              //Cut
              type: "Button",
              buttonSettings: {
                iconCss: "e-icons e-cut",
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .filemanager["Tooltip-Cut"],
                clicked: function () {
                  toolbarButtonClick("cut", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .filemanager["Tooltip-Cut"],
              },
            },
            {
              //Paste
              type: "Button",
              buttonSettings: {
                iconCss: "e-icons e-paste",
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .filemanager["Tooltip-Paste"],
                clicked: function () {
                  toolbarButtonClick("Paste", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .filemanager["Tooltip-Paste"],
              },
            }
          ]
        }
      ],
      Font: [
        {
          items: [
            {
              //Font Family
              type: "ComboBox",
              id: "fontFamilySelect",
              comboBoxSettings: {
                dataSource: config.font?.availableFamilies,
                label: "Font Style",
                width: "115px",
                popupWidth: "150px",
                value:
                  editor.documentEditor.selection.characterFormat
                    .fontFamily,
                allowFiltering: true,
                change: function (args: { itemData: { text: string } }) {
                  if (args.itemData) {
                    changeFontFamily({
                      value: args.itemData.text,
                    });
                  }
                },
              }
            },
            {
              //Font Size
              type: "ComboBox",
              id: "fontSizeSelect",
              comboBoxSettings: {
                dataSource: config.font?.availableSizes.map(value =>
                  value.toString()
                ),
                label: "Font Size",
                popupWidth: "85px",
                width: "65px",
                allowFiltering: true,
                value:
                  editor.documentEditor.selection.characterFormat.fontSize +
                  "",
                change: function (args: { itemData: { text: string } }) {
                  if (args.itemData) {
                    changeFontSize({
                      value: Number(args.itemData.text),
                    });
                  }
                },
              }
            },
            {
              //Font Color
              type: "ColorPicker",
              id: "fontColorSelect",
              displayOptions: DisplayMode.Simplified | DisplayMode.Classic,
              colorPickerSettings: {
                change: function (args: { currentValue: { hex: string } }) {
                  changeFontColor({
                    currentValue: { hex: args.currentValue.hex },
                  });
                },
                value: editor.documentEditor.selection.characterFormat
                  .fontColor
                  ? editor.documentEditor.selection.characterFormat
                    .fontColor
                  : `#000`,
              }
            },
            {
              //Bold
              type: "Button",
              id: "bold",
              allowedSizes: RibbonItemSize.Small,
              buttonSettings: {
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Bold Tooltip"],
                isToggle: true,
                iconCss: "e-icons e-bold",
                clicked: function () {
                  toolbarButtonClick("bold", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Bold Tooltip"],
              }
            },
            {
              //Italic
              type: "Button",
              allowedSizes: RibbonItemSize.Small,
              id: "italic",
              buttonSettings: {
                isToggle: true,
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Italic Tooltip"],
                clicked: function () {
                  toolbarButtonClick("italic", editor);
                },
                iconCss: "e-icons e-italic",
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Italic Tooltip"],
              }
            },
            {
              //Underline
              type: "Button",
              allowedSizes: RibbonItemSize.Small,
              id: "underline",
              buttonSettings: {
                isToggle: true,
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Underline Tooltip"],
                clicked: function () {
                  toolbarButtonClick("underline", editor);
                },
                iconCss: "e-icons e-underline",
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Underline Tooltip"],
              }
            },
            {
              //Strike Through
              allowedSizes: RibbonItemSize.Small,
              type: "Button",
              id: "strikethrough",
              buttonSettings: {
                iconCss: "e-icons e-strikethrough",
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Strikethrough"],
                isToggle: true,
                clicked: function () {
                  toolbarButtonClick("strikethrough", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Strikethrough"],
              }
            }
          ]
        }
      ],
      Paragraph: [
        {
          items: [
            {
              //Decrease indent
              type: "Button",
              allowedSizes: RibbonItemSize.Small,
              buttonSettings: {
                iconCss: "e-icons e-decrease-indent",
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Decrease indent"],
                clicked: function () {
                  toolbarButtonClick("DecreaseIndent", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Decrease indent"],
              }
            },
            {
              //Increase Ident
              type: "Button",
              allowedSizes: RibbonItemSize.Small,
              buttonSettings: {
                iconCss: "e-icons e-increase-indent",
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Increase indent"],
                clicked: function () {
                  toolbarButtonClick("IncreaseIndent", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Increase indent"],
              }
            },
            {
              //Line Spacing
              type: "ComboBox",
              id: "lineSpacingSelect",
              comboBoxSettings: {
                dataSource: ["1", "1.15", "1.5", "2"],
                label: "Line Spacing",
                popupWidth: "85px",
                width: "70px",
                value: editor.documentEditor.selection.paragraphFormat
                  .lineSpacing
                  ? editor.documentEditor.selection.paragraphFormat
                      .lineSpacing + ""
                  : editor.documentEditor.documentHelper.paragraphFormat
                      .lineSpacing + "",
                change: function (args: { itemData: { text: number } }) {
                  if (args.itemData) {
                    changeLineSpacing({ value: args.itemData.text });
                  }
                },
              }
            },
            {
              //Bullets
              type: "Button",
              allowedSizes: RibbonItemSize.Small,
              buttonSettings: {
                iconCss: "e-icons e-list-unordered-3",
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Bullets"],
                clicked: function () {
                  toolbarButtonClick("Bullets", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Bullets"],
              }
            },
            {
              //Numbered Order
              type: "Button",
              allowedSizes: RibbonItemSize.Small,
              buttonSettings: {
                iconCss: "e-icons e-list-ordered",
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Numbering"],
                clicked: function () {
                  toolbarButtonClick("Numbering", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Numbering"],
              }
            },
            {
              //Paragraph Mark
              type: "Button",
              allowedSizes: RibbonItemSize.Small,
              buttonSettings: {
                iconCss: "e-icons e-paragraph",
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Paragraph"],
                clicked: function () {
                  toolbarButtonClick("ShowParagraphMark", editor);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Paragraph"],
              }
            }
          ]
        }
      ],
      Alignment: [
        {
          items: [
            {
              //Align Left
              iconCss: "e-icons e-align-left",
              selected: true,
              click: function () {
                toolbarButtonClick("AlignLeft", editor);
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Align left Tooltip"],
              }
            },
            {
              //Align Center
              iconCss: "e-icons e-align-center",
              click: function () {
                toolbarButtonClick("AlignCenter", editor);
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Align center"],
              }
            },
            {
              //Align Right
              iconCss: "e-icons e-align-right",
              click: function () {
                toolbarButtonClick("AlignRight", editor);
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Align right Tooltip"],
              }
            },
            {
              //Justify
              iconCss: "e-icons e-justify",
              click: function () {
                toolbarButtonClick("Justify", editor);
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditorcontainer["Justify Tooltip"],
              }
            }
          ]
        }
      ],
      Navigation: [
        {
          items: [
            {
              //Navigation Select
              type: "DropDown",
              id: "navigation_fields",
              dropDownSettings: {
                iconCss: "e-icons e-bookmark",
                content:
                  editorContainerLocale.language.iaraTranslate.customfields
                    .content,
                items: [
                  {
                    id: "add_field",
                    iconCss: "e-icons e-plus",
                    text: editorContainerLocale.language.iaraTranslate
                      .customfields.add,
                  },
                  {
                    id: "add_mandatory_field",
                    iconCss: "e-icons e-lock",
                    text: editorContainerLocale.language.iaraTranslate
                      .customfields.mandatory,
                  },
                  {
                    id: "add_optional_field",
                    iconCss: "e-icons e-circle-info",
                    text: editorContainerLocale.language.iaraTranslate
                      .customfields.optional,
                  },
                  {
                    id: "next_field",
                    iconCss: "e-icons e-arrow-right",
                    text: editorContainerLocale.language.iaraTranslate
                      .customfields.next,
                  },
                  {
                    id: "previous_field",
                    iconCss: "e-icons e-arrow-left",
                    text: editorContainerLocale.language.iaraTranslate
                      .customfields.previous,
                  },
                ],
              }
            }
          ]
        }
      ],
      Export: [
        {
          items: [
            {
              //PDF
              type: "Button",
              buttonSettings: {
                iconCss: "e-icons e-export-pdf",
                content:
                  editorContainerLocale.language.syncfusionTranslate
                    .pivotview["pdf"],
                clicked: function () {
                  toolbarButtonClick("ExportToPDF", editor, config);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate.grid[
                    "Pdfexport"
                  ],
              }
            }
          ]
        }
      ],
      Trackchanges: [
        {
          items: [
            {
              //Track Changes
              id: "trackChangesBtn",
              type: "Button",
              buttonSettings: {
                iconCss: "e-icons e-changes-track",
                content:
                  editorContainerLocale.language.iaraTranslate.changes
                    .trackchanges,
                clicked: function () {
                  toolbarButtonClick("ToggleTrackChanges", editor, config);
                },
              },
              ribbonTooltipSettings: {
                title:
                  editorContainerLocale.language.syncfusionTranslate
                    .documenteditor["Tracked changes"],
              }
            }
          ]
        }
      ]
    }
  ];


  const tabs = [
    {
      groups: [
        {
          collections: [
            {
              items: [
                {
                  // type: "Button",
                  // buttonSettings: {
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Open"],
                  //   isToggle: true,
                  //   iconCss: "e-icons e-folder-open",
                  //   clicked: function () {
                  //     toolbarOpenFile("open", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .PdfViewer["Open"],
                  // },
                },
                {
                  // type: "Button",
                  // buttonSettings: {
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Undo"],
                  //   isToggle: true,
                  //   iconCss: "e-icons e-undo",
                  //   clicked: function () {
                  //     toolbarButtonClick("undo", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Undo Tooltip"],
                  // },
                },
                {
                  // type: "Button",
                  // buttonSettings: {
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Redo"],
                  //   isToggle: true,
                  //   iconCss: "e-icons e-redo",
                  //   clicked: function () {
                  //     toolbarButtonClick("redo", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Redo Tooltip"],
                  // },
                },
              ],
            },
          ],
        },
        {
          header:
            editorContainerLocale.language.syncfusionTranslate.documenteditor[
              "Insert"
            ],
          id: "insert",
          collections: [
            {
              items: [
                {
                  type: "Button",
                  buttonSettings: {
                    content:
                      editorContainerLocale.language.syncfusionTranslate
                        .documenteditorcontainer["Image"],
                    iconCss: "e-icons e-image",
                    clicked: function () {
                      toolbarOpenFile("image", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.language.syncfusionTranslate
                        .richtexteditor["image"],
                  },
                },
              ],
            },
            {
              items: [
                {
                  type: "Button",
                  buttonSettings: {
                    content:
                      editorContainerLocale.language.syncfusionTranslate
                        .richtexteditor["inserttablebtn"],
                    iconCss: "e-icons e-table",
                    clicked: function () {
                      toolbarButtonClick("insertTable", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.language.syncfusionTranslate
                        .documenteditorcontainer[
                        "Insert a table into the document"
                      ],
                  },
                },
              ],
            },
          ],
        },
        {
          header:
            editorContainerLocale.language.syncfusionTranslate
              .documenteditorcontainer["Local Clipboard"],
          id: "clipboard",
          groupIconCss: "e-icons e-paste",
          collections: [
            {
              items: [
                {
                  // type: "Button",
                  // buttonSettings: {
                  //   iconCss: "e-icons e-paste",
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .filemanager["Tooltip-Paste"],
                  //   clicked: function () {
                  //     toolbarButtonClick("Paste", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .filemanager["Tooltip-Paste"],
                  // },
                },
              ],
            },
            {
              items: [
                {
                  // type: "Button",
                  // buttonSettings: {
                  //   iconCss: "e-icons e-cut",
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .filemanager["Tooltip-Cut"],
                  //   clicked: function () {
                  //     toolbarButtonClick("cut", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .filemanager["Tooltip-Cut"],
                  // },
                },
                {
                  // type: "Button",
                  // buttonSettings: {
                  //   iconCss: "e-icons e-copy",
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .filemanager["Tooltip-Copy"],
                  //   clicked: function () {
                  //     toolbarButtonClick("copy", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .filemanager["Tooltip-Copy"],
                  // },
                },
              ],
            },
          ],
        },
        {
          header:
            editorContainerLocale.language.syncfusionTranslate.documenteditor[
              "Font"
            ],
          groupIconCss: "e-icons e-bold",
          cssClass: "font-group",
          overflowHeader: "More Font Options",
          id: "font",
          orientation: "Row",
          collections: [
            {
              items: [
                {
                  // type: "ComboBox",
                  // id: "fontFamilySelect",
                  // comboBoxSettings: {
                  //   dataSource: config.font?.availableFamilies,
                  //   label: "Font Style",
                  //   width: "115px",
                  //   popupWidth: "150px",
                  //   value:
                  //     editor.documentEditor.selection.characterFormat
                  //       .fontFamily,
                  //   allowFiltering: true,
                  //   change: function (args: { itemData: { text: string } }) {
                  //     if (args.itemData) {
                  //       changeFontFamily({
                  //         value: args.itemData.text,
                  //       });
                  //     }
                  //   },
                  // },
                },
                {
                  // type: "ComboBox",
                  // id: "fontSizeSelect",
                  // comboBoxSettings: {
                  //   dataSource: config.font?.availableSizes.map(value =>
                  //     value.toString()
                  //   ),
                  //   label: "Font Size",
                  //   popupWidth: "85px",
                  //   width: "65px",
                  //   allowFiltering: true,
                  //   value:
                  //     editor.documentEditor.selection.characterFormat.fontSize +
                  //     "",
                  //   change: function (args: { itemData: { text: string } }) {
                  //     if (args.itemData) {
                  //       changeFontSize({
                  //         value: Number(args.itemData.text),
                  //       });
                  //     }
                  //   },
                  // },
                },
              ],
            },
            {
              items: [
                {
                  // type: "ColorPicker",
                  // id: "fontColorSelect",
                  // displayOptions: DisplayMode.Simplified | DisplayMode.Classic,
                  // colorPickerSettings: {
                  //   change: function (args: { currentValue: { hex: string } }) {
                  //     changeFontColor({
                  //       currentValue: { hex: args.currentValue.hex },
                  //     });
                  //   },
                  //   value: editor.documentEditor.selection.characterFormat
                  //     .fontColor
                  //     ? editor.documentEditor.selection.characterFormat
                  //         .fontColor
                  //     : `#000`,
                  // },
                },
                {
                  // type: "Button",
                  // id: "bold",
                  // allowedSizes: RibbonItemSize.Small,
                  // buttonSettings: {
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Bold Tooltip"],
                  //   isToggle: true,
                  //   iconCss: "e-icons e-bold",
                  //   clicked: function () {
                  //     toolbarButtonClick("bold", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Bold Tooltip"],
                  // },
                },
                {
                  // type: "Button",
                  // allowedSizes: RibbonItemSize.Small,
                  // id: "italic",
                  // buttonSettings: {
                  //   isToggle: true,
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Italic Tooltip"],
                  //   clicked: function () {
                  //     toolbarButtonClick("italic", editor);
                  //   },
                  //   iconCss: "e-icons e-italic",
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Italic Tooltip"],
                  // },
                },
                {
                  // type: "Button",
                  // allowedSizes: RibbonItemSize.Small,
                  // id: "underline",
                  // buttonSettings: {
                  //   isToggle: true,
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Underline Tooltip"],
                  //   clicked: function () {
                  //     toolbarButtonClick("underline", editor);
                  //   },
                  //   iconCss: "e-icons e-underline",
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Underline Tooltip"],
                  // },
                },
                {
                  // allowedSizes: RibbonItemSize.Small,
                  // type: "Button",
                  // id: "strikethrough",
                  // buttonSettings: {
                  //   iconCss: "e-icons e-strikethrough",
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Strikethrough"],
                  //   isToggle: true,
                  //   clicked: function () {
                  //     toolbarButtonClick("strikethrough", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Strikethrough"],
                  // },
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
                //       editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
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
          header:
            editorContainerLocale.language.syncfusionTranslate
              .documenteditorcontainer["Paragraph"],
          groupIconCss: "e-icons e-align-center",
          collections: [
            {
              items: [
                {
                  // type: "Button",
                  // allowedSizes: RibbonItemSize.Small,
                  // buttonSettings: {
                  //   iconCss: "e-icons e-decrease-indent",
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Decrease indent"],
                  //   clicked: function () {
                  //     toolbarButtonClick("DecreaseIndent", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Decrease indent"],
                  // },
                },
                {
                  // type: "Button",
                  // allowedSizes: RibbonItemSize.Small,
                  // buttonSettings: {
                  //   iconCss: "e-icons e-increase-indent",
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Increase indent"],
                  //   clicked: function () {
                  //     toolbarButtonClick("IncreaseIndent", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Increase indent"],
                  // },
                },
                {
                  // type: "ComboBox",
                  // id: "lineSpacingSelect",
                  // comboBoxSettings: {
                  //   dataSource: ["1", "1.15", "1.5", "2"],
                  //   label: "Line Spacing",
                  //   popupWidth: "85px",
                  //   width: "70px",
                  //   value: editor.documentEditor.selection.paragraphFormat
                  //     .lineSpacing
                  //     ? editor.documentEditor.selection.paragraphFormat
                  //         .lineSpacing + ""
                  //     : editor.documentEditor.documentHelper.paragraphFormat
                  //         .lineSpacing + "",
                  //   change: function (args: { itemData: { text: number } }) {
                  //     if (args.itemData) {
                  //       changeLineSpacing({ value: args.itemData.text });
                  //     }
                  //   },
                  // },
                },
                {
                  // type: "Button",
                  // allowedSizes: RibbonItemSize.Small,
                  // buttonSettings: {
                  //   iconCss: "e-icons e-list-unordered-3",
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Bullets"],
                  //   clicked: function () {
                  //     toolbarButtonClick("Bullets", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Bullets"],
                  // },
                },
                {
                  // type: "Button",
                  // allowedSizes: RibbonItemSize.Small,
                  // buttonSettings: {
                  //   iconCss: "e-icons e-list-ordered",
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Numbering"],
                  //   clicked: function () {
                  //     toolbarButtonClick("Numbering", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Numbering"],
                  // },
                },
                {
                  // type: "Button",
                  // allowedSizes: RibbonItemSize.Small,
                  // buttonSettings: {
                  //   iconCss: "e-icons e-paragraph",
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Paragraph"],
                  //   clicked: function () {
                  //     toolbarButtonClick("ShowParagraphMark", editor);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditorcontainer["Paragraph"],
                  // },
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
                        // iconCss: "e-icons e-align-left",
                        // selected: true,
                        // click: function () {
                        //   toolbarButtonClick("AlignLeft", editor);
                        // },
                        // ribbonTooltipSettings: {
                        //   title:
                        //     editorContainerLocale.language.syncfusionTranslate
                        //       .documenteditorcontainer["Align left Tooltip"],
                        // },
                      },
                      {
                        // iconCss: "e-icons e-align-center",
                        // click: function () {
                        //   toolbarButtonClick("AlignCenter", editor);
                        // },
                        // ribbonTooltipSettings: {
                        //   title:
                        //     editorContainerLocale.language.syncfusionTranslate
                        //       .documenteditorcontainer["Align center"],
                        // },
                      },
                      {
                        // iconCss: "e-icons e-align-right",
                        // click: function () {
                        //   toolbarButtonClick("AlignRight", editor);
                        // },
                        // ribbonTooltipSettings: {
                        //   title:
                        //     editorContainerLocale.language.syncfusionTranslate
                        //       .documenteditorcontainer["Align right Tooltip"],
                        // },
                      },
                      {
                        // iconCss: "e-icons e-justify",
                        // click: function () {
                        //   toolbarButtonClick("Justify", editor);
                        // },
                        // ribbonTooltipSettings: {
                        //   title:
                        //     editorContainerLocale.language.syncfusionTranslate
                        //       .documenteditorcontainer["Justify Tooltip"],
                        // },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          id: "navigation_fields_content",
          header:
            editorContainerLocale.language.iaraTranslate.customfields.header,
          groupIconCss: "e-icons e-align-center",
          collections: [
            {
              items: [
                {
                  // type: "DropDown",
                  // id: "navigation_fields",
                  // dropDownSettings: {
                  //   iconCss: "e-icons e-bookmark",
                  //   content:
                  //     editorContainerLocale.language.iaraTranslate.customfields
                  //       .content,
                  //   items: [
                  //     {
                  //       id: "add_field",
                  //       iconCss: "e-icons e-plus",
                  //       text: editorContainerLocale.language.iaraTranslate
                  //         .customfields.add,
                  //     },
                  //     {
                  //       id: "add_mandatory_field",
                  //       iconCss: "e-icons e-lock",
                  //       text: editorContainerLocale.language.iaraTranslate
                  //         .customfields.mandatory,
                  //     },
                  //     {
                  //       id: "add_optional_field",
                  //       iconCss: "e-icons e-circle-info",
                  //       text: editorContainerLocale.language.iaraTranslate
                  //         .customfields.optional,
                  //     },
                  //     {
                  //       id: "next_field",
                  //       iconCss: "e-icons e-arrow-right",
                  //       text: editorContainerLocale.language.iaraTranslate
                  //         .customfields.next,
                  //     },
                  //     {
                  //       id: "previous_field",
                  //       iconCss: "e-icons e-arrow-left",
                  //       text: editorContainerLocale.language.iaraTranslate
                  //         .customfields.previous,
                  //     },
                  //   ],
                  // },
                },
              ],
            },
          ],
        },
        {
          id: "export_group",
          header:
            editorContainerLocale.language.syncfusionTranslate.grid["Export"],
          groupIconCss: "e-icons e-align-center",
          collections: [
            {
              items: [
                {
                  // type: "Button",
                  // buttonSettings: {
                  //   iconCss: "e-icons e-export-pdf",
                  //   content:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .pivotview["pdf"],
                  //   clicked: function () {
                  //     toolbarButtonClick("ExportToPDF", editor, config);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate.grid[
                  //       "Pdfexport"
                  //     ],
                  // },
                },
              ],
            },
          ],
        },
        {
          id: "track_changes",
          header: editorContainerLocale.language.iaraTranslate.changes.header,
          collections: [
            {
              items: [
                {
                  // id: "trackChangesBtn",
                  // type: "Button",
                  // buttonSettings: {
                  //   iconCss: "e-icons e-changes-track",
                  //   content:
                  //     editorContainerLocale.language.iaraTranslate.changes
                  //       .trackchanges,
                  //   clicked: function () {
                  //     toolbarButtonClick("ToggleTrackChanges", editor, config);
                  //   },
                  // },
                  // ribbonTooltipSettings: {
                  //   title:
                  //     editorContainerLocale.language.syncfusionTranslate
                  //       .documenteditor["Tracked changes"],
                  // },
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const simplifiedTabs = [
    {
      groups: [
        {
          id: "fonts",
          orientation: "Row",
          groupIconCss: "e-icons e-align-center",
          collections: [
            {
              items: [
                {
                  type: "Button",
                  id: "bold",
                  allowedSizes: RibbonItemSize.Medium,
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
                      editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
                      "Bold Tooltip"
                      ],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  id: "italic",
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
                      editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
                      "Italic Tooltip"
                      ],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  id: "underline",
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
                      editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
                      "Underline Tooltip"
                      ],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  id: "strikethrough",
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
                      editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
                      "Strikethrough"
                      ],
                  },
                },
                {
                  type: "ComboBox",
                  id: "fontFamilySelect",
                  comboBoxSettings: {
                    dataSource: config.font?.availableFamilies,
                    label: "Font Style",
                    width: "115px",
                    popupWidth: "150px",
                    value:
                      editor.documentEditor.selection.characterFormat
                        .fontFamily,
                    allowFiltering: true,
                    change: function (args: { itemData: { text: string } }) {
                      if (args.itemData) {
                        changeFontFamily({
                          value: args.itemData.text,
                        });
                      }
                    },
                  },
                },
                {
                  type: "ComboBox",
                  allowedSizes: RibbonItemSize.Small,
                  id: "fontSizeSelect",
                  comboBoxSettings: {
                    dataSource: config.font?.availableSizes.map(value =>
                      value.toString()
                    ),
                    label: "Font Size",
                    popupWidth: "85px",
                    width: "65px",
                    allowFiltering: true,
                    value:
                      editor.documentEditor.selection.characterFormat.fontSize +
                      "",
                    change: function (args: { itemData: { text: string } }) {
                      if (args.itemData) {
                        changeFontSize({
                          value: Number(args.itemData.text),
                        });
                      }
                    },
                  },
                },
                {
                  type: "ColorPicker",
                  id: "fontColorSelect",
                  displayOptions: DisplayMode.Simplified | DisplayMode.Classic,
                  colorPickerSettings: {
                    change: function (args: { currentValue: { hex: string } }) {
                      changeFontColor({
                        currentValue: { hex: args.currentValue.hex },
                      });
                    },
                    value: editor.documentEditor.selection.characterFormat
                      .fontColor
                      ? editor.documentEditor.selection.characterFormat
                        .fontColor
                      : `#000`,
                  },
                },
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
                            editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
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
                            editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
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
                            editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
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
                            editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
                            "Justify Tooltip"
                            ],
                        },
                      },
                    ],
                  },
                },
              ]
            }
          ]
        },
        {
          id: "paragraph_group",
          orientation: "Row",
          // header: editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer["Paragraph"],
          groupIconCss: "e-icons e-align-center",
          collections: [
            {
              items: [
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    iconCss: "e-icons e-list-unordered-3",
                    content: "Bullets",
                    clicked: function () {
                      toolbarButtonClick("Bullets", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer["Bullets"],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    iconCss: "e-icons e-list-ordered",
                    content: "Numbering",
                    clicked: function () {
                      toolbarButtonClick("Numbering", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
                        "Numbering"
                      ],
                  },
                },
                {
                  type: "ComboBox",
                  id: "lineSpacingSelect",
                  comboBoxSettings: {
                    dataSource: ["1", "1.15", "1.5", "2"],
                    label: "Line Spacing",
                    popupWidth: "85px",
                    width: "70px",
                    value: editor.documentEditor.selection.paragraphFormat
                      .lineSpacing
                      ? editor.documentEditor.selection.paragraphFormat
                          .lineSpacing + ""
                      : editor.documentEditor.documentHelper.paragraphFormat
                          .lineSpacing + "",
                    change: function (args: { itemData: { text: number } }) {
                      if (args.itemData) {
                        changeLineSpacing({ value: args.itemData.text });
                      }
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
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
                        "Paragraph"
                      ],
                  },
                },
              ],
            },
          ],
        },
        {
          id: "control",
          orientation: "Row",
          groupIconCss: "e-icons e-align-center",
          collections: [
            {
              items: [
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    content: "Inserir Tabela",
                    iconCss: "e-icons e-table",
                    clicked: function () {
                      toolbarButtonClick("insertTable", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
                        "Insert a table into the document"
                      ],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    content:
                      editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer["Image"],
                    iconCss: "e-icons e-image",
                    clicked: function () {
                      toolbarOpenFile("image", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title: editorContainerLocale.language.syncfusionTranslate.richtexteditor["image"],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    content: "Desfazer",
                    isToggle: true,
                    iconCss: "e-icons e-undo",
                    clicked: function () {
                      toolbarButtonClick("undo", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
                        "Undo Tooltip"
                      ],
                  },
                },
                {
                  type: "Button",
                  allowedSizes: RibbonItemSize.Small,
                  buttonSettings: {
                    content: "Refazer",
                    isToggle: true,
                    iconCss: "e-icons e-redo",
                    clicked: function () {
                      toolbarButtonClick("redo", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                    editorContainerLocale.language.syncfusionTranslate.documenteditorcontainer[
                      "Redo Tooltip"
                    ],
                  },
                },
              ],
            },
          ],
        }
      ]
    }
  ];


  if (config.editRibbon)
  {
    editor.documentEditor.zoomFactor = Number(0.95);
    return simplifiedTabs;
  }

  return tabs;
};
