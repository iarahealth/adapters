import {
  Ribbon,
  ItemOrientation,
  RibbonItemSize,
  RibbonItemType,
  RibbonTabModel,
  RibbonColorPicker,
  DisplayMode,
  RibbonFileMenu,
} from "@syncfusion/ej2-ribbon";
import { MenuItemModel, MenuEventArgs } from "@syncfusion/ej2-navigations";

Ribbon.Inject(RibbonFileMenu, RibbonColorPicker);

const fontStyle: string[] = [
  "Algerian",
  "Arial",
  "Calibri",
  "Cambria",
  "Cambria Math",
  "Courier New",
  "Candara",
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

export const ribbonSettings = (): Ribbon => {
  // const tabs: RibbonTabModel[] = [
  //   {
  //     header: "Home",
  //     groups: [
  //       {
  //         collections: [
  //           {
  //             items: [
  //               {
  //                 type: RibbonItemType.SplitButton,
  //                 allowedSizes: RibbonItemSize.Large,
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

  const tabs: RibbonTabModel[] = [
    {
      header: "Home",
      groups: [
        {
          collections: [
            {
              items: [
                {
                  type: RibbonItemType.SplitButton,
                  allowedSizes: RibbonItemSize.Large,
                  splitButtonSettings: {
                    iconCss: "e-icons e-paste",
                    items: [
                      { text: "Keep Source Format" },
                      { text: "Merge format" },
                      { text: "Keep text only" },
                    ],
                    content: "Paste",
                  },
                },
              ],
            },
            {
              items: [
                {
                  type: RibbonItemType.Button,
                  buttonSettings: {
                    content: "Cut",
                    iconCss: "e-icons e-cut",
                  },
                },
                {
                  type: RibbonItemType.Button,
                  buttonSettings: {
                    content: "Copy",
                    iconCss: "e-icons e-copy",
                  },
                },
                {
                  type: RibbonItemType.Button,
                  buttonSettings: {
                    content: "Format Painter",
                    iconCss: "e-icons e-format-painter",
                  },
                },
              ],
            },
          ],
        },
        {
          orientation: ItemOrientation.Row,
          collections: [
            {
              items: [
                {
                  type: RibbonItemType.ComboBox,
                  comboBoxSettings: {
                    dataSource: fontStyle,
                    index: 3,
                    allowFiltering: true,
                    width: "150px",
                  },
                },
                {
                  type: RibbonItemType.ComboBox,
                  comboBoxSettings: {
                    dataSource: fontSize,
                    index: 3,
                    width: "65px",
                  },
                },
              ],
            },
            {
              items: [
                {
                  type: RibbonItemType.Button,
                  buttonSettings: {
                    content: "Bold",
                    iconCss: "e-icons e-bold",
                  },
                },
                {
                  type: RibbonItemType.Button,
                  buttonSettings: {
                    content: "Italic",
                    iconCss: "e-icons e-italic",
                  },
                },
                {
                  type: RibbonItemType.Button,
                  buttonSettings: {
                    content: "Underline",
                    iconCss: "e-icons e-underline",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  const menuItems: MenuItemModel[] = [
    { text: "New", iconCss: "e-icons e-file-new", id: "new" },
    { text: "Open", iconCss: "e-icons e-folder-open", id: "Open" },
    { text: "Rename", iconCss: "e-icons e-rename", id: "rename" },
    { text: "Save as", iconCss: "e-icons e-save", id: "save" },
  ];

  const ribbon: Ribbon = new Ribbon({
    tabs: tabs,
    // fileMenu: {
    //   menuItems: menuItems,
    //   visible: true,
    // },
  });

  return ribbon;
};
