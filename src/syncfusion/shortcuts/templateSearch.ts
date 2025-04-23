import { DataManager, Query } from "@syncfusion/ej2-data";
import { ListView } from "@syncfusion/ej2-lists";
import { Dialog, DialogUtility } from "@syncfusion/ej2-popups";

export class IaraSyncfusionTemplateSearch {
  private _template: (data: { name: string }) => string;
  private _listviewInstance: ListView;
  constructor(
    private _dataSource: {
      name: string;
      category: string;
      content: string;
      id: number;
      templateIara: boolean;
    }[],
    private _onTemplateSelected: (
      listViewInstance: ListView,
      dialogObj: Dialog
    ) => void
  ) {
    const transformedData = this._dataSource.map(item => ({
      ...item,
      category: item.templateIara ? `${item.category} Iara` : item.category,
    }));

    this._template = (data: {
      name: string;
    }) => `<div class="e-list-wrapper" style="padding-left:10px; overflow: auto; height: 120px;">
      <div class="e-list-wrappere-list-multi-line">
        <span class="e-list-content">${data.name}</span>
      </div>
    </div>`;

    const customGroupTemplate = (data: {
      items: { name: string; category: string; content: string; id: number }[];
    }) => {
      const rawCategory = data.items[0].category;
      const count = data.items.length;
      const category =
        count > 1
          ? rawCategory
              .replace(/^Template$/, "Templates")
              .replace(/^Frase$/, "Frases")
              .replace(/^Template Iara$/, "Templates Iara")
          : rawCategory;
      return `
        <div>
          <span class="category">${category}</span>
          <span class="count"> ${count} Item(s)</span>
        </div>
      `;
    };

    this._listviewInstance = new ListView({
      dataSource: transformedData,
      sortOrder: "None",
      fields: { text: "name", groupBy: "category" },
      template: this._template,
      groupTemplate: customGroupTemplate,
    });

    const dialogObj = DialogUtility.alert({
      title: "<div class='dlg-template'>Selecione</div>",
      content: `<div class="e-list-wrapper" >
      <input class="e-input" autocomplete="false" type="text" id="textbox" placeholder="Buscar" title="Type in a name">
      <div id='listview' style="overflow: auto; max-height: 300px;"></div>
      </div>`,
      width: "350px",
      showCloseIcon: true,
      closeOnEscape: true,
      okButton: { text: "" },
    });
    this._listviewInstance.appendTo("#listview");
    document.getElementById("textbox")?.addEventListener("keyup", () => {
      this.filter(this._listviewInstance, this._dataSource);
    });
    this._onTemplateSelected(this._listviewInstance, dialogObj);
  }

  filter(
    listObj: ListView,
    listData: { name: string; category: string; content: string }[]
  ): void {
    if (document.getElementById("textbox")) {
      const value = (document.getElementById("textbox") as HTMLInputElement)
        .value;
      const data: unknown[] = new DataManager(listData).executeLocal(
        new Query().where("name", "contains", value, true)
      );
      if (!value) {
        listObj.dataSource = listData.slice();
      } else {
        listObj.dataSource = data as {
          [key: string]: Record<string, unknown>;
        }[];
      }
      listObj.dataBind();

      if (data.length > 0) {
        const atMenuItems = listObj["liCollection"];
        const firstItem = atMenuItems[0] as HTMLElement;
        firstItem.classList.add("e-active");
      }
    }
    return;
  }
}
