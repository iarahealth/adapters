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
  toolbarButtonClick: (arg: string, editor: DocumentEditorContainer) => void,
  editorContainerLocale: typeof EJ2_LOCALE["pt-BR"],
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
                    dataSource: config.font.availableFamilies,
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
                    dataSource: config.font.availableSizes.map(value =>
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
                  allowedSizes: RibbonItemSize.Small,
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
                  type: "Button",
                  buttonSettings: {
                    iconCss: "e-icons e-bookmark e-align-center",
                    content: "Campos de navegação",
                    clicked: function () {
                      toolbarButtonClick("navigationFields", editor);
                    },
                  },
                  ribbonTooltipSettings: {
                    title: "Campos de navegação",
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
