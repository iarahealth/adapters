import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
import * as EJ2_LOCALE from "@syncfusion/ej2-locale/src/pt-BR.json";
import {
  DisplayMode,
  FileMenuEventArgs,
  RibbonCollectionModel,
  RibbonGroupButtonSelection,
  RibbonItemModel,
  RibbonItemSize,
  RibbonTabModel,
} from "@syncfusion/ej2-ribbon";
import { IaraSyncfusionConfig } from "..";
import { IaraSyncfusionNavigationFieldManager } from "../navigationFields";
import { RibbonFontMethods, RibbonParagraphMethods } from "./config";

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

  const allItems = {
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

    alignment: {
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
                editorContainerLocale.documenteditorcontainer["Align center"],
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

    export: {
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

    trackchanges: {
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

  const collection = (
    collectionItems: RibbonCollectionModel[],
    collectionTab:
      | "file"
      | "insert"
      | "clipboard"
      | "font"
      | "paragraph"
      | "navigation"
      | "export"
      | "trackchanges"
  ) => {
    if (
      config.ribbonConfig?.ribbonItems &&
      Object.keys(config.ribbonConfig.ribbonItems).length
    ) {
      if (config.ribbonConfig.ribbonItems[collectionTab]) {
        if (
          collectionTab === "navigation" ||
          collectionTab === "export" ||
          collectionTab === "trackchanges"
        ) {
          return collectionItems;
        }
        if (config.ribbonConfig.ribbonItems[collectionTab].length > 0) {
          let collectionCustomItems: { items: RibbonItemModel[] }[] = [];
          const ribbonItems = config.ribbonConfig?.ribbonItems[collectionTab];

          ribbonItems.forEach(items => {
            collectionCustomItems = [
              ...collectionCustomItems,
              { items: items.map(item => allItems[item]) },
            ];
          });
          return collectionCustomItems;
        }
        return collectionItems;
      }
      return [];
    }
    return collectionItems;
  };

  const fileItems = [{ items: [allItems.open, allItems.undo, allItems.redo] }];

  const insertItems = [
    { items: [allItems.image] },
    { items: [allItems.table] },
  ];

  const clipboardItems = [
    { items: [allItems.paste] },
    { items: [allItems.cut, allItems.copy] },
  ];

  const fontItems = [
    { items: [allItems.fontFamily, allItems.fontSize] },
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

  const paragraphItems = [
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
      items: [allItems.alignment],
    },
  ];

  const naviagtionItem = [{ items: [allItems.navigation] }];

  const exportItem = [{ items: [allItems.export] }];

  const trackChangeItem = [{ items: [allItems.trackchanges] }];

  const tabs: RibbonTabModel[] = [
    {
      groups: [
        {
          collections: collection(fileItems, "file"),
        },
        {
          header: editorContainerLocale.documenteditor["Insert"],
          id: "insert",
          collections: collection(insertItems, "insert"),
        },
        {
          header:
            editorContainerLocale.documenteditorcontainer["Local Clipboard"],
          id: "clipboard",
          groupIconCss: "e-icons e-paste",
          collections: collection(clipboardItems, "clipboard"),
        },
        {
          header: editorContainerLocale.documenteditor["Font"],
          groupIconCss: "e-icons e-bold",
          cssClass: "font-group",
          overflowHeader: "More Font Options",
          id: "font",
          orientation: "Row",
          collections: collection(fontItems, "font"),
        },
        {
          id: "paragraph_group",
          orientation: "Row",
          header: editorContainerLocale.documenteditorcontainer["Paragraph"],
          groupIconCss: "e-icons e-align-center",
          collections: collection(paragraphItems, "paragraph"),
        },
        {
          header: "Marcadores",
          isCollapsible: false,
          collections: collection(naviagtionItem, "navigation"),
        },
        {
          id: "export_group",
          header: editorContainerLocale.grid["Export"],
          groupIconCss: "e-icons e-align-center",
          collections: collection(exportItem, "export"),
        },
        {
          id: "track_changes",
          header: "Revisão",
          collections: collection(trackChangeItem, "trackchanges"),
        },
      ],
    },
  ];

  return tabs;
};
