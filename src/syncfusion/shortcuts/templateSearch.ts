import { DataManager, Query } from "@syncfusion/ej2-data";
import { ListView } from "@syncfusion/ej2-lists";
import { Dialog, DialogUtility } from "@syncfusion/ej2-popups";

export class IaraSyncfusionTemplateSearch {
  private _template: string;
  private _listviewInstance: ListView;
  constructor(
    private _dataSource: { name: string; category: string; content: string }[],
    private _onTemplateSelected: (
      listViewInstance: ListView,
      dialogObj: Dialog
    ) => void
  ) {
    this._template =
      '<div class="e-list-wrapper" style="padding-left:10px; overflow: auto; height: 120px;">' +
      '<div class="e-list-wrappere-list-multi-line">' +
      '<span class="e-list-item-header">${name}</span>' +
      "</div>" +
      "</div>";

    this._listviewInstance = new ListView({
      dataSource: this._dataSource,
      sortOrder: "None",
      fields: { text: "name", groupBy: "category" },
      template: this._template,
      groupTemplate:
        '<div><span class="category">${items[0].category}</span> <span class="count"> ${items.length} Item(s)</span></div> ',
    });

    const dialogObj = DialogUtility.alert({
      title: "<div class='dlg-template'>Selecione a frase/template</div>",
      content: `<div class="e-list-wrapper" >
      <input class="e-input" type="text" id="textbox" placeholder="Buscar" title="Type in a name">
      <div id='listview' style="overflow: auto; max-height: 300px;"></div>
      </div>`,
      width: "350px",
      showCloseIcon: true,
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
        new Query().where("name", "startswith", value, true)
      );
      if (!value) {
        listObj.dataSource = listData.slice();
      } else {
        listObj.dataSource = data as {
          [key: string]: Record<string, unknown>;
        }[];
      }
      listObj.dataBind();
    }
    return;
  }
}