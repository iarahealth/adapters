import { DocumentEditorContainer } from "@syncfusion/ej2-documenteditor";
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
import { IaraLanguages } from "../language/language";
import { RibbonCollection, RibbonCustomItems } from "./ribbon";

export const tabsConfig = (
  editor: DocumentEditorContainer,
  toolbarOpenFile: (arg: string, editor: DocumentEditorContainer) => void,
  toolbarButtonClick: (
    arg: string,
    editor: DocumentEditorContainer,
    config?: IaraSyncfusionConfig,
    navigationFields?: IaraSyncfusionNavigationFieldManager
  ) => void,
  editorContainerLocale: IaraLanguages,
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
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
          editorContainerLocale.language.syncfusionTranslate.PdfViewer["Open"],
      },
    },
    undo: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      },
    },
    redo: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      },
    },
    image: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
          editorContainerLocale.language.syncfusionTranslate.richtexteditor[
            "image"
          ],
      },
    },

    table: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
      buttonSettings: {
        content:
          editorContainerLocale.language.syncfusionTranslate.richtexteditor[
            "inserttablebtn"
          ],
        iconCss: "e-icons e-table",
        clicked: function () {
          toolbarButtonClick("insertTable", editor);
        },
      },
      ribbonTooltipSettings: {
        title:
          editorContainerLocale.language.syncfusionTranslate
            .documenteditorcontainer["Insert a table into the document"],
      },
    },

    paste: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
      buttonSettings: {
        iconCss: "e-icons e-paste",
        content:
          editorContainerLocale.language.syncfusionTranslate.filemanager[
            "Tooltip-Paste"
          ],
        clicked: function () {
          toolbarButtonClick("Paste", editor);
        },
      },
      ribbonTooltipSettings: {
        title:
          editorContainerLocale.language.syncfusionTranslate.filemanager[
            "Tooltip-Paste"
          ],
      },
    },

    copy: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
      buttonSettings: {
        iconCss: "e-icons e-copy",
        content:
          editorContainerLocale.language.syncfusionTranslate.filemanager[
            "Tooltip-Copy"
          ],
        clicked: function () {
          toolbarButtonClick("copy", editor);
        },
      },
      ribbonTooltipSettings: {
        title:
          editorContainerLocale.language.syncfusionTranslate.filemanager[
            "Tooltip-Copy"
          ],
      },
    },

    cut: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
      buttonSettings: {
        iconCss: "e-icons e-cut",
        content:
          editorContainerLocale.language.syncfusionTranslate.filemanager[
            "Tooltip-Cut"
          ],
        clicked: function () {
          toolbarButtonClick("cut", editor);
        },
      },
      ribbonTooltipSettings: {
        title:
          editorContainerLocale.language.syncfusionTranslate.filemanager[
            "Tooltip-Cut"
          ],
      },
    },

    fontFamily: {
      type: "ComboBox",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      },
    },

    italic: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      },
    },

    underline: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      },
    },

    strikeThrough: {
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      },
    },

    decreaseIdent: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      },
    },

    increaseIdent: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      },
    },

    lineSpacing: {
      type: "ComboBox",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      },
    },

    numbering: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      },
    },

    paragraphMark: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
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
      },
    },

    alignment: {
      type: "GroupButton",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
      groupButtonSettings: {
        selection: RibbonGroupButtonSelection.Single,
        items: [
          {
            iconCss: "e-icons e-align-left",
            click: function () {
              toolbarButtonClick("AlignLeft", editor);
            },
            ribbonTooltipSettings: {
              title:
                editorContainerLocale.language.syncfusionTranslate
                  .documenteditorcontainer["Align left Tooltip"],
            },
          },
          {
            iconCss: "e-icons e-align-center",
            click: function () {
              toolbarButtonClick("AlignCenter", editor);
            },
            ribbonTooltipSettings: {
              title:
                editorContainerLocale.language.syncfusionTranslate
                  .documenteditorcontainer["Align center"],
            },
          },
          {
            iconCss: "e-icons e-align-right",
            click: function () {
              toolbarButtonClick("AlignRight", editor);
            },
            ribbonTooltipSettings: {
              title:
                editorContainerLocale.language.syncfusionTranslate
                  .documenteditorcontainer["Align right Tooltip"],
            },
          },
          {
            iconCss: "e-icons e-justify",
            click: function () {
              toolbarButtonClick("Justify", editor);
            },
            ribbonTooltipSettings: {
              title:
                editorContainerLocale.language.syncfusionTranslate
                  .documenteditorcontainer["Justify Tooltip"],
            },
          },
        ],
      },
    },
    navigationField: {
      type: "DropDown",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : RibbonItemSize.Large,
      dropDownSettings: {
        iconCss: "e-icons e-bookmark",
        content:
          editorContainerLocale.language.iaraTranslate.customfields.content,
        items: [
          {
            id: "add_field",
            iconCss: "e-icons e-add-above",
            text: editorContainerLocale.language.iaraTranslate.customfields.add,
          },
          {
            id: "add_mandatory_field",
            iconCss: "e-icons e-lock",
            text: editorContainerLocale.language.iaraTranslate.customfields
              .mandatory,
          },
          {
            id: "add_optional_field",
            iconCss: "e-icons e-circle-info",
            text: editorContainerLocale.language.iaraTranslate.customfields
              .optional,
          },
          // {
          //   id: "add_additive_field",
          //   iconCss: "e-icons e-plus",
          //   text: editorContainerLocale.language.iaraTranslate.customfields
          //     .additive,
          // },
          {
            id: "next_field",
            iconCss: "e-icons e-arrow-right",
            text: editorContainerLocale.language.iaraTranslate.customfields
              .next,
          },
          {
            id: "previous_field",
            iconCss: "e-icons e-arrow-left",
            text: editorContainerLocale.language.iaraTranslate.customfields
              .previous,
          },
        ],
        select: (e: FileMenuEventArgs) => {
          navigationFunc(e.element.id);
        },
      },
    },

    exportPdf: {
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
      buttonSettings: {
        iconCss: "e-icons e-export-pdf",
        content:
          editorContainerLocale.language.syncfusionTranslate.pivotview["pdf"],
        clicked: function () {
          toolbarButtonClick("ExportToPDF", editor, config);
        },
      },
      ribbonTooltipSettings: {
        title:
          editorContainerLocale.language.syncfusionTranslate.grid["Pdfexport"],
      },
    },

    trackchanges: {
      id: "trackChangesBtn",
      type: "Button",
      allowedSizes: config.ribbon?.displayMode === 'Simplified' ? RibbonItemSize.Small : undefined,
      buttonSettings: {
        iconCss: "e-icons e-changes-track",
        content:
          editorContainerLocale.language.iaraTranslate.changes.trackchanges,
        clicked: function () {
          toolbarButtonClick("ToggleTrackChanges", editor, config);
        },
      },
      ribbonTooltipSettings: {
        title:
          editorContainerLocale.language.iaraTranslate.changes.trackchanges,
      },
    },
  };

  const defaultCollections = {
    file: true,
    insert: true,
    clipboard: true,
    font: true,
    paragraph: true,
    navigation: false,
    export: false,
    documentReview: false,
  };

  const collection = (
    collectionItems: RibbonCollectionModel[],
    collectionTab: RibbonCollection
  ) => {
    if (
      config.ribbon?.collections &&
      Object.keys(config.ribbon.collections).length
    ) {
      if (config.ribbon.collections[collectionTab] !== undefined) {
        if (!Array.isArray(config.ribbon.collections[collectionTab])) {
          defaultCollections[collectionTab] =
            !!config.ribbon.collections[collectionTab];

          if (defaultCollections[collectionTab]) {
            return collectionItems;
          }
        } else {
          let collectionCustomItems: { items: RibbonItemModel[] }[] = [];
          const ribbon = config.ribbon.collections[
            collectionTab
          ] as RibbonCustomItems;

          ribbon.forEach(items => {
            collectionCustomItems = [
              ...collectionCustomItems,
              { items: items.map(item => allItems[item]) },
            ];
          });
          return collectionCustomItems;
        }
      }
    }
    if (defaultCollections[collectionTab]) {
      return collectionItems;
    }
    return [];
  };

  const fileItems = [
    { items: [allItems.open] },
    { items: [allItems.undo, allItems.redo] }
  ];

  const insertItems = [
    { items: [allItems.image] },
    { items: [allItems.table] },
  ];

  const clipboardItems = [
    { items: [allItems.paste] },
    { items: [allItems.cut, allItems.copy] },
  ];

  const fontItems = [
    { items: [allItems.fontFamily, allItems.fontSize, allItems.fontColor] },
    { items: [allItems.bold, allItems.italic] },
    { items: [allItems.underline, allItems.strikeThrough] },
  ];

  const paragraphItems = [
    {
      items: [
        allItems.paragraphMark,
        allItems.decreaseIdent,
        allItems.increaseIdent
      ]
    },
    {
      items: [
        allItems.lineSpacing,
        allItems.bullets,
        allItems.numbering
      ]
    },
    {
      items: [allItems.alignment]
    },
  ];

  const naviagtionItem = [{ items: [allItems.navigationField] }];

  const exportItem = [{ items: [allItems.exportPdf] }];

  const documentReviewItem = [{ items: [allItems.trackchanges] }];

  const tabs: RibbonTabModel[] = [
    {
      groups: [
        {
          id: "file",
          collections: collection(fileItems, "file"),
        },
        {
          header:
            editorContainerLocale.language.syncfusionTranslate.documenteditor[
              "Insert"
            ],
          id: "insert",
          collections: collection(insertItems, "insert"),
        },
        {
          header:
            editorContainerLocale.language.syncfusionTranslate
              .documenteditorcontainer["Local Clipboard"],
          id: "clipboard",
          groupIconCss: "e-icons e-paste",
          collections: collection(clipboardItems, "clipboard"),
        },
        {
          header:
            editorContainerLocale.language.syncfusionTranslate.documenteditor[
              "Font"
            ],
          groupIconCss: "e-icons e-bold",
          cssClass: "font-group",
          // overflowHeader: "More Font Options",
          id: "font",
          orientation: "Row",
          collections: collection(fontItems, "font"),
        },
        {
          id: "paragraph_group",
          orientation: "Row",
          header:
            editorContainerLocale.language.syncfusionTranslate
              .documenteditorcontainer["Paragraph"],
          groupIconCss: "e-icons e-paragraph",
          collections: collection(paragraphItems, "paragraph"),
        },
        {
          header:
            editorContainerLocale.language.iaraTranslate.customfields.header,
          isCollapsible: false,
          collections: collection(naviagtionItem, "navigation"),
        },
        {
          id: "export_group",
          header:
            editorContainerLocale.language.syncfusionTranslate.grid["Export"],
          groupIconCss: "e-icons e-export",
          collections: collection(exportItem, "export"),
        },
        {
          id: "track_changes",
          header: editorContainerLocale.language.iaraTranslate.changes.header,
          collections: collection(documentReviewItem, "documentReview"),
        },
      ],
    },
  ];

  return tabs;
};
