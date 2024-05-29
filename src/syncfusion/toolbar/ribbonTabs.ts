import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import * as EJ2_LOCALE from "@syncfusion/ej2-locale/src/pt-BR.json";
import {
  DisplayMode,
  FileMenuEventArgs,
  RibbonGroupButtonSelection,
  RibbonItemModel,
  RibbonItemSize,
  RibbonTabModel,
} from "@syncfusion/ej2-ribbon";
import { IaraSyncfusionConfig } from "..";
import { RibbonFontMethods, RibbonParagraphMethods } from "./config";
import { IaraSyncfusionNavigationFieldManager } from "../navigationFields";

export const tabsConfig = (
  editor: DocumentEditorContainer,
  toolbarOpenFile: (arg: string, editor: DocumentEditorContainer) => void,
  toolbarButtonClick: (
    arg: string,
    editor: DocumentEditorContainer,
    config?: IaraSyncfusionConfig,
    navigationFields?: IaraSyncfusionNavigationFieldManager
  ) => void,
  editorContainerLocale: (typeof EJ2_LOCALE)["pt-BR"],
  config: IaraSyncfusionConfig,
  ribbonMethods: {
    ribbonFontMethods: (editor: DocumentEditorContainer) => RibbonFontMethods;
    ribbonParagraphMethods: (
      editor: DocumentEditorContainer
    ) => RibbonParagraphMethods;
  },
  navigationFunc: (funcId: string) => void
): RibbonTabModel[] => {
  const { changeFontColor, changeFontSize, changeFontFamily } =
    ribbonMethods.ribbonFontMethods(editor);
  const { changeLineSpacing } = ribbonMethods.ribbonParagraphMethods(editor);

  const allItems: any = {
    open: {
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
    undo: {
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
        title: editorContainerLocale.documenteditorcontainer["Undo Tooltip"],
      },
    },
    redo: {
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
        title: editorContainerLocale.documenteditorcontainer["Redo Tooltip"],
      },
    },
    image: {
      type: "Button",
      buttonSettings: {
        content: editorContainerLocale.documenteditorcontainer["Image"],
        iconCss: "e-icons e-image",
        clicked: function () {
          toolbarOpenFile("image", editor);
        },
      },
      ribbonTooltipSettings: {
        title: editorContainerLocale.richtexteditor["image"],
      },
    },

    table: {
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

    paste: {
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

    copy: {
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

    cut: {
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

    fontFamily: {
      type: "ComboBox",
      id: "fontFamilySelect",
      comboBoxSettings: {
        dataSource: config.font?.availableFamilies,
        label: "Font Style",
        width: "115px",
        popupWidth: "150px",
        value: editor.documentEditor.selection.characterFormat.fontFamily,
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

    fontSize: {
      type: "ComboBox",
      id: "fontSizeSelect",
      comboBoxSettings: {
        dataSource: config.font?.availableSizes.map(value => value.toString()),
        label: "Font Size",
        popupWidth: "85px",
        width: "65px",
        allowFiltering: true,
        value: editor.documentEditor.selection.characterFormat.fontSize + "",
        change: function (args: { itemData: { text: string } }) {
          if (args.itemData) {
            changeFontSize({
              value: Number(args.itemData.text),
            });
          }
        },
      },
    },

    fontColor: {
      type: "ColorPicker",
      id: "fontColorSelect",
      displayOptions: DisplayMode.Simplified | DisplayMode.Classic,
      colorPickerSettings: {
        change: function (args: { currentValue: { hex: string } }) {
          changeFontColor({
            currentValue: { hex: args.currentValue.hex },
          });
        },
        value: editor.documentEditor.selection.characterFormat.fontColor
          ? editor.documentEditor.selection.characterFormat.fontColor
          : `#000`,
      },
    },

    bold: {
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
        title: editorContainerLocale.documenteditorcontainer["Bold Tooltip"],
      },
    },

    italic: {
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
        title: editorContainerLocale.documenteditorcontainer["Italic Tooltip"],
      },
    },

    underline: {
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
          editorContainerLocale.documenteditorcontainer["Underline Tooltip"],
      },
    },

    strikeThrough: {
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
        title: editorContainerLocale.documenteditorcontainer["Strikethrough"],
      },
    },

    decreaseIdent: {
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
        title: editorContainerLocale.documenteditorcontainer["Decrease indent"],
      },
    },

    increaseIdent: {
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
        title: editorContainerLocale.documenteditorcontainer["Increase indent"],
      },
    },

    lineSpacing: {
      type: "ComboBox",
      id: "lineSpacingSelect",
      comboBoxSettings: {
        dataSource: ["1", "1.15", "1.5", "2"],
        label: "Line Spacing",
        popupWidth: "85px",
        width: "70px",
        value: editor.documentEditor.selection.paragraphFormat.lineSpacing
          ? editor.documentEditor.selection.paragraphFormat.lineSpacing + ""
          : editor.documentEditor.documentHelper.paragraphFormat.lineSpacing +
            "",
        change: function (args: { itemData: { text: number } }) {
          if (args.itemData) {
            changeLineSpacing({ value: args.itemData.text });
          }
        },
      },
    },

    bullets: {
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
        title: editorContainerLocale.documenteditorcontainer["Bullets"],
      },
    },

    numbering: {
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
        title: editorContainerLocale.documenteditorcontainer["Numbering"],
      },
    },

    paragraphMark: {
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
        title: editorContainerLocale.documenteditorcontainer["Paragraph"],
      },
    },

    alignLeft: {
      iconCss: "e-icons e-align-left",
      selected: true,
      click: function () {
        toolbarButtonClick("AlignLeft", editor);
      },
      ribbonTooltipSettings: {
        title:
          editorContainerLocale.documenteditorcontainer["Align left Tooltip"],
      },
    },

    alignCenter: {
      iconCss: "e-icons e-align-center",
      click: function () {
        toolbarButtonClick("AlignCenter", editor);
      },
      ribbonTooltipSettings: {
        title: editorContainerLocale.documenteditorcontainer["Align center"],
      },
    },

    alignRight: {
      iconCss: "e-icons e-align-right",
      click: function () {
        toolbarButtonClick("AlignRight", editor);
      },
      ribbonTooltipSettings: {
        title:
          editorContainerLocale.documenteditorcontainer["Align right Tooltip"],
      },
    },

    justify: {
      iconCss: "e-icons e-justify",
      click: function () {
        toolbarButtonClick("Justify", editor);
      },
      ribbonTooltipSettings: {
        title: editorContainerLocale.documenteditorcontainer["Justify Tooltip"],
      },
    },

    navigation: {
      type: "DropDown",
      allowedSizes: RibbonItemSize.Large,
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
            id: "add_mandatory_field",
            iconCss: "e-icons e-lock",
            text: "Adicionar campo obrigatório",
          },
          {
            id: "add_optional_field",
            iconCss: "e-icons e-circle-info",
            text: "Adicionar campo opcional",
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
        select: (e: FileMenuEventArgs) => {
          navigationFunc(e.element.id);
        },
      },
    },

    exportPdf: {
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

    trackChanges: {
      id: "trackChangesBtn",
      type: "Button",
      buttonSettings: {
        iconCss: "e-icons e-changes-track",
        content: "Rastrear mudanças",
        clicked: function () {
          toolbarButtonClick("ToggleTrackChanges", editor, config);
        },
      },
      ribbonTooltipSettings: {
        title: editorContainerLocale.documenteditor["Tracked changes"],
      },
    },
  };

  const fileCollection = () => {
    if (
      config.ribbonConfig?.ribbonItems &&
      Object.keys(config.ribbonConfig?.ribbonItems).length
    ) {
      if (config.ribbonConfig?.ribbonItems.file) {
        if (config.ribbonConfig?.ribbonItems.file.length > 0) {
          const fileItems: RibbonItemModel[] =
            config.ribbonConfig?.ribbonItems.file.map(item => {
              return allItems[item];
            });
          return [
            {
              items: fileItems,
            },
          ];
        }
        return [
          {
            items: [allItems.open, allItems.undo, allItems.redo],
          },
        ];
      }
      return [];
    }
    return [
      {
        items: [allItems.open, allItems.undo, allItems.redo],
      },
    ];
  };

  const insertCollection = () => {
    if (
      config.ribbonConfig?.ribbonItems &&
      Object.keys(config.ribbonConfig?.ribbonItems).length
    ) {
      if (config.ribbonConfig?.ribbonItems.insert) {
        if (config.ribbonConfig?.ribbonItems.insert.length > 0) {
          const insertItemsFirst: RibbonItemModel[] = [];
          const insertItemsSecond: RibbonItemModel[] = [];
          config.ribbonConfig?.ribbonItems.insert.map(item => {
            if (item == "image") insertItemsFirst.push(allItems.image);
            if (item == "table") insertItemsSecond.push(allItems.table);
          });

          return [
            {
              items: insertItemsFirst,
            },
            {
              items: insertItemsSecond,
            },
          ];
        }
        return [
          {
            items: [allItems.image],
          },
          {
            items: [allItems.table],
          },
        ];
      }
      return [];
    }
    return [
      {
        items: [allItems.image],
      },
      {
        items: [allItems.table],
      },
    ];
  };

  const clipboardCollection = () => {
    if (
      config.ribbonConfig?.ribbonItems &&
      Object.keys(config.ribbonConfig?.ribbonItems).length
    ) {
      if (config.ribbonConfig?.ribbonItems.clipboard) {
        if (config.ribbonConfig?.ribbonItems.clipboard.length > 0) {
          const clipboardItems: RibbonItemModel[] = [];

          config.ribbonConfig?.ribbonItems.clipboard.map(item => {
            if (item == "paste") clipboardItems.push(allItems.paste);
            if (item == "copy") clipboardItems.push(allItems.copy);
            if (item == "cut") clipboardItems.push(allItems.cut);
          });

          return [
            {
              items: clipboardItems,
            },
          ];
        }
        return [
          {
            items: [allItems.paste],
          },
          {
            items: [allItems.cut, allItems.copy],
          },
        ];
      }
      return [];
    }
    return [
      {
        items: [allItems.paste],
      },
      {
        items: [allItems.cut, allItems.copy],
      },
    ];
  };

  const fontCollection = () => {
    if (
      config.ribbonConfig?.ribbonItems &&
      Object.keys(config.ribbonConfig?.ribbonItems).length
    ) {
      if (config.ribbonConfig?.ribbonItems.font) {
        if (config.ribbonConfig?.ribbonItems.font.length > 0) {
          const clipboardFirstItems: RibbonItemModel[] = [];
          const clipboardSecondItems: RibbonItemModel[] = [];
          config.ribbonConfig?.ribbonItems.font.map(item => {
            if (item == "fontFamily")
              clipboardFirstItems.push(allItems.fontFamily);
            if (item == "fontSize") clipboardFirstItems.push(allItems.fontSize);
            if (item == "fontColor")
              clipboardSecondItems.push(allItems.fontColor);
            if (item == "bold") clipboardSecondItems.push(allItems.bold);
            if (item == "italic") clipboardSecondItems.push(allItems.italic);
            if (item == "underline")
              clipboardSecondItems.push(allItems.underline);
            if (item == "strikeThrough")
              clipboardSecondItems.push(allItems.strikeThrough);
          });

          return [
            {
              items: clipboardFirstItems,
            },
            {
              items: clipboardSecondItems,
            },
          ];
        }
        return [
          {
            items: [allItems.fontFamily, allItems.fontSize],
          },
          {
            items: [
              allItems.fontColor,
              allItems.bold,
              allItems.italic,
              allItems.underline,
              allItems.strikeThrough,
            ],
          },
        ];
      }
      return [];
    }
    return [
      {
        items: [allItems.fontFamily, allItems.fontSize],
      },
      {
        items: [
          allItems.fontColor,
          allItems.bold,
          allItems.italic,
          allItems.underline,
          allItems.strikeThrough,
        ],
      },
    ];
  };

  const paragraphCollection = () => {
    if (
      config.ribbonConfig?.ribbonItems &&
      Object.keys(config.ribbonConfig?.ribbonItems).length
    ) {
      if (config.ribbonConfig?.ribbonItems.paragraph) {
        if (config.ribbonConfig?.ribbonItems.paragraph.length > 0) {
          const paragraphFirstItems: RibbonItemModel[] = [];
          const paragraphSecondItems: RibbonItemModel[] = [];
          config.ribbonConfig?.ribbonItems.paragraph.map(item => {
            if (item == "decreaseIdent")
              paragraphFirstItems.push(allItems.decreaseIdent);
            if (item == "increaseIdent")
              paragraphFirstItems.push(allItems.increaseIdent);
            if (item == "lineSpacing")
              paragraphFirstItems.push(allItems.lineSpacing);
            if (item == "bullets") paragraphFirstItems.push(allItems.bullets);
            if (item == "numbering")
              paragraphFirstItems.push(allItems.numbering);
            if (item == "paragraphMark")
              paragraphFirstItems.push(allItems.paragraphMark);
            if (item == "alignLeft")
              paragraphSecondItems.push(allItems.alignLeft);
            if (item == "alignCenter")
              paragraphSecondItems.push(allItems.alignCenter);
            if (item == "alignRight")
              paragraphSecondItems.push(allItems.alignRight);
            if (item == "justify") paragraphSecondItems.push(allItems.justify);
          });

          return [
            {
              items: paragraphFirstItems,
            },
            {
              type: "GroupButton",
              allowedSizes: RibbonItemSize.Small,
              groupButtonSettings: {
                selection: RibbonGroupButtonSelection.Single,
                header: "Alignment",
                items: paragraphSecondItems,
              },
            },
          ];
        }
        return [
          {
            items: [
              allItems.decreaseIdent,
              allItems.increaseIdent,
              allItems.lineSpacing,
              allItems.bullets,
              allItems.numbering,
              allItems.paragraphMark,
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
                    allItems.alignLeft,
                    allItems.alignCenter,
                    allItems.alignRight,
                    allItems.justify,
                  ],
                },
              },
            ],
          },
        ];
      }
      return [];
    }
    return [
      {
        items: [
          allItems.decreaseIdent,
          allItems.increaseIdent,
          allItems.lineSpacing,
          allItems.bullets,
          allItems.numbering,
          allItems.paragraphMark,
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
                allItems.alignLeft,
                allItems.alignCenter,
                allItems.alignRight,
                allItems.justify,
              ],
            },
          },
        ],
      },
    ];
  };

  const navigationCollection = () => {
    if (
      config.ribbonConfig?.ribbonItems &&
      Object.keys(config.ribbonConfig?.ribbonItems).length
    ) {
      if (config.ribbonConfig?.ribbonItems.navigation) {
        return [
          {
            items: [allItems.navigation],
          },
        ];
      } else {
        return [];
      }
    }
    return [
      {
        items: [allItems.navigation],
      },
    ];
  };

  const exporPdfCollection = () => {
    if (
      config.ribbonConfig?.ribbonItems &&
      Object.keys(config.ribbonConfig?.ribbonItems).length
    ) {
      if (config.ribbonConfig?.ribbonItems.export) {
        return [
          {
            items: [allItems.exportPdf],
          },
        ];
      } else {
        return [];
      }
    }
    return [
      {
        items: [allItems.exportPdf],
      },
    ];
  };

  const trackChangesCollection = () => {
    if (
      config.ribbonConfig?.ribbonItems &&
      Object.keys(config.ribbonConfig?.ribbonItems).length
    ) {
      if (config.ribbonConfig?.ribbonItems.trackchanges) {
        return [
          {
            items: [allItems.trackChanges],
          },
        ];
      } else {
        return [];
      }
    }
    return [
      {
        items: [allItems.trackChanges],
      },
    ];
  };

  const tabs: RibbonTabModel[] = [
    {
      groups: [
        {
          collections: fileCollection(),
        },
        {
          header: editorContainerLocale.documenteditor["Insert"],
          id: "insert",
          collections: insertCollection(),
        },
        {
          header:
            editorContainerLocale.documenteditorcontainer["Local Clipboard"],
          id: "clipboard",
          groupIconCss: "e-icons e-paste",
          collections: clipboardCollection(),
        },
        {
          header: editorContainerLocale.documenteditor["Font"],
          groupIconCss: "e-icons e-bold",
          cssClass: "font-group",
          overflowHeader: "More Font Options",
          id: "font",
          orientation: "Row",
          collections: fontCollection(),
        },
        {
          id: "paragraph_group",
          orientation: "Row",
          header: editorContainerLocale.documenteditorcontainer["Paragraph"],
          groupIconCss: "e-icons e-align-center",
          collections: paragraphCollection(),
        },
        {
          header: "Marcadores",
          isCollapsible: false,
          collections: navigationCollection(),
        },
        {
          id: "export_group",
          header: editorContainerLocale.grid["Export"],
          groupIconCss: "e-icons e-align-center",
          collections: exporPdfCollection(),
        },
        {
          id: "track_changes",
          header: "Revisão",
          collections: trackChangesCollection(),
        },
      ],
    },
  ];

  return tabs;
};
