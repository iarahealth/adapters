import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import * as EJ2_LOCALE from "@syncfusion/ej2-locale/src/pt-BR.json";
import {
  DisplayMode,
  RibbonGroupButtonSelection,
  RibbonItemSize,
  RibbonTabModel,
} from "@syncfusion/ej2-ribbon";
import { IaraSyncfusionConfig } from "..";
import { RibbonFontMethods, RibbonParagraphMethods } from "./config";

export const tabsConfig = (
  editor: DocumentEditorContainer,
  toolbarOpenFile: (arg: string, editor: DocumentEditorContainer) => void,
  toolbarButtonClick: (
    arg: string,
    editor: DocumentEditorContainer,
    config?: IaraSyncfusionConfig
  ) => void,
  editorContainerLocale: (typeof EJ2_LOCALE)["pt-BR"],
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
  const tabs = [
    {
      groups: [
        {
          collections: [
            {
              items: [
                {
                  type: "Button",
                  buttonSettings: {
                    content: "Abrir",
                    isToggle: true,
                    iconCss: "e-icons e-folder-open",
                    clicked: function () {
                      toolbarOpenFile("open", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title: editorContainerLocale.PdfViewer["Open"],
                  },
                },
                {
                  type: "Button",
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
                      editorContainerLocale.documenteditorcontainer[
                        "Undo Tooltip"
                      ],
                  },
                },
                {
                  type: "Button",
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
          header: editorContainerLocale.documenteditor["Insert"],
          id: "insert",
          collections: [
            {
              items: [
                {
                  type: "Button",
                  buttonSettings: {
                    content:
                      editorContainerLocale.documenteditorcontainer["Image"],
                    iconCss: "e-icons e-image",
                    clicked: function () {
                      toolbarOpenFile("image", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title: editorContainerLocale.richtexteditor["image"],
                  },
                },
              ],
            },
            {
              items: [
                {
                  type: "Button",
                  buttonSettings: {
                    content: "Inserir Tabela",
                    iconCss: "e-icons e-table",
                    clicked: function () {
                      toolbarButtonClick("insertTable", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.documenteditorcontainer[
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
            editorContainerLocale.documenteditorcontainer["Local Clipboard"],
          id: "clipboard",
          groupIconCss: "e-icons e-paste",
          collections: [
            {
              items: [
                {
                  type: "Button",
                  buttonSettings: {
                    iconCss: "e-icons e-paste",
                    content: editorContainerLocale.filemanager["Tooltip-Paste"],
                    clicked: function () {
                      toolbarButtonClick("Paste", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title: editorContainerLocale.filemanager["Tooltip-Paste"],
                  },
                },
              ],
            },
            {
              items: [
                {
                  type: "Button",
                  buttonSettings: {
                    iconCss: "e-icons e-cut",
                    content: editorContainerLocale.filemanager["Tooltip-Cut"],
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
                  buttonSettings: {
                    iconCss: "e-icons e-copy",
                    content: editorContainerLocale.filemanager["Tooltip-Copy"],
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
          header: editorContainerLocale.documenteditor["Font"],
          groupIconCss: "e-icons e-bold",
          cssClass: "font-group",
          overflowHeader: "More Font Options",
          id: "font",
          orientation: "Row",
          collections: [
            {
              items: [
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
              ],
            },
            {
              items: [
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
                  type: "Button",
                  id: "bold",
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
                      editorContainerLocale.documenteditorcontainer[
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
                      editorContainerLocale.documenteditorcontainer[
                        "Underline Tooltip"
                      ],
                  },
                },
                {
                  allowedSizes: RibbonItemSize.Small,
                  type: "Button",
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
          header: editorContainerLocale.documenteditorcontainer["Paragraph"],
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
                    iconCss: "e-icons e-list-unordered-3",
                    content: "Bullets",
                    clicked: function () {
                      toolbarButtonClick("Bullets", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title:
                      editorContainerLocale.documenteditorcontainer["Bullets"],
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
                      editorContainerLocale.documenteditorcontainer[
                        "Numbering"
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
        {
          id: "navigation_fields",
          header: "Marcadores",
          groupIconCss: "e-icons e-align-center",
          collections: [
            {
              items: [
                {
                  type: "DropDown",

                  dropDownSettings: {
                    iconCss: "e-icons e-bookmark",
                    content: "Campos de navegação",
                    items: [
                      {
                        id: "add_field",
                        iconCss: "e-icons e-plus",
                        text: "Adicionar campo",
                      },
                      {
                        id: "next_field",
                        iconCss: "e-icons e-arrow-right",
                        text: "Próximo campo",
                      },
                      {
                        id: "previous_field",
                        iconCss: "e-icons e-arrow-left",
                        text: "Campo anterior",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          id: "export_group",
          header: editorContainerLocale.grid["Export"],
          groupIconCss: "e-icons e-align-center",
          collections: [
            {
              items: [
                {
                  type: "Button",
                  buttonSettings: {
                    iconCss: "e-icons e-export-pdf",
                    content: "PDF",
                    clicked: function () {
                      toolbarButtonClick("ExportToPDF", editor, config);
                    },
                  },
                  ribbonTooltipSettings: {
                    title: editorContainerLocale.grid["Pdfexport"],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  return tabs;
};
