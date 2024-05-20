import { DataManager, Query } from "@syncfusion/ej2-data";
import { ListView } from "@syncfusion/ej2-lists";
import { Dialog, DialogUtility } from "@syncfusion/ej2-popups";

//braun
import {
  DocumentEditor,
  DocumentEditorKeyDownEventArgs,
} from "@syncfusion/ej2-documenteditor";
// import { Button } from '@syncfusion/ej2-buttons';

export class IaraSyncfusionTemplateSearch {
  private _template: (data: { name: string }) => string;
  private _listviewInstance: ListView;
  constructor(
    private _dataSource: { name: string; category: string; content: string }[],
    private _onTemplateSelected: (
      listViewInstance: ListView,
      dialogObj: Dialog
    ) => void,
    private _editor: DocumentEditor,
  ) {
    this._template = (data: {
      name: string;
    }) => `<div class="e-list-wrapper" style="padding-left:10px; overflow: auto; height: 120px;">
      <div class="e-list-wrappere-list-multi-line">
        <span class="e-list-item-header">${data.name}</span>
      </div>
    </div>`;

    const customGroupTemplate = (data: {
      items: { name: string; category: string; content: string }[];
    }) => {
      return `<div>
        <span class="category">${
          data.items.length > 1
            ? data.items[0].category + "s"
            : data.items[0].category
        }</span>
        <span class="count"> ${data.items.length} Item(s)</span>
      </div>`;
    };

    this._listviewInstance = new ListView({
      dataSource: this._dataSource,
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

    // this._editor.keyDown = this.onKeyDown.bind(this);

    // const atMenuElements = document.getElementsByClassName("e-list-item e-level-1");

    // console.log(atMenuElements);

    // for(var i=0; i<atMenuElements.length; i++){
    //   atMenuElements[i].addEventListener("keyup", () => {
    //       console.log(atMenuElements);
    //   });
    // }

    // Array.from(atMenuElements).forEach(function(atMenuElement) {
    //   atMenuElement.addEventListener('keydown', atMenuItemEnter());
    // });

    // document.getElementsByClassName("e-list-item e-level-1")?.addEventListener("keydown", (event) => {
      // The parameter event is of the type KeyboardEvent
      // addRow(event);
    // });
      // addEventListener("keyup", () => {
      // this.filter(this._listviewInstance, this._dataSource);
    // }
    // );

    // dialogObj.addEventListener()
      // .keyDown = this.onKeyDown.bind(this);
  }


  //braun
  atMenuItemEnter(): void
  {
    console.log('ENTEROU');
  }

  //braun
  onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    console.log(args.event);
    switch (args.event.key) {
      case "Enter":
        // this.shortcutByAt();
        console.log('ENTERERRRRRR');
        break;
    }
  }

  //braun
  shortcutByTabAndShiftTab(args: DocumentEditorKeyDownEventArgs): void {
    if (args.event.shiftKey && args.event.key == "Tab") {
      // this._navigationFieldManager.previousField(true);
    } else if (args.event.key == "Tab") {
      // this._navigationFieldManager.nextField(true);
    }
  }


  filter(
    listObj: ListView,
    listData: { name: string; category: string; content: string }[],
  ): void {
    if (document.getElementById("textbox")) {
      const value = (document.getElementById("textbox") as HTMLInputElement)
        .value;
      const data: any[] = new DataManager(listData).executeLocal(
        new Query().where("name", "contains", value, true)
      );
      if (!value) {
        listObj.dataSource = listData.slice();
      } else {
        listObj.dataSource = data as {
          [key: string]: Record<string, unknown>;
        }[];
      }


      //braun


      // console.log('PAGANDO VALUE DA QUERY', value);
      // console.log('PAGANDO VALUE DA QUERY', data.length);
      // if (data.length > 0)
      //   {
          // const selectedItem: string = data[0]['name'];
          // console.log('SELECTED ITEM111', listObj.dataSource[0]);
          // console.log('SELECTED ITEM222', selectedItem);

          // this._listviewInstance.checkBoxPosition = selectedItem;
            // data[0]
        // }


        // console.log('1111111111',listObj.element.focus);
      // console.log('1111111111', data);


      listObj.dataBind();



      if (data.length > 0)
      {

        // console.log('this._editor.keyDown', this._editor.keyDown);
        // console.log('this.onKeyDown.bind(this)', this.onKeyDown.bind(this));

        // this._listviewInstance['liCollection'][0].focus();
        // listObj['liCollection'][0].focus();

        // console.log('DATA', data[0]);
        // console.log('LISTOBJ', listObj['liCollection'][0] as HTMLElement);
        let atMenuItems = listObj['liCollection'];
        let firstItem = atMenuItems[0] as HTMLElement;
        firstItem.classList.add('e-active');

        // const listItems = document.querySelectorAll('.list-item');

        //  console.log('AT MENU ITENS', atMenuItems);
        // console.log('LIST ITEMS', listItems);
        // listObj.addEventListener('keydown', this.atMenuItemEnter);
        atMenuItems.forEach((item: any) => {

          console.log('FOREACH');


          item.addEventListener('keypress', (event: any) => {

            console.log('ENTROU');

            if (event.key === 'Enter') {

              console.log('ENTERENTERNENTNERN');
              // Executar ações desejadas
            }
          });
        });



      // let clickEvent = () => {
      //     console.log('some event content here...')
      //   }

      // atMenuItens.forEach((item: any) => {
      //     item.addEventListener('keypress', clickEvent)
      // });


            // for(var i=0; i<atMenuElements.length; i++){
    //   atMenuElements[i].addEventListener("keyup", () => {
    //       console.log(atMenuElements);
    //   });
    // }

    // Array.from(atMenuItens).forEach(atMenuItem => {
    //   atMenuItem.addEventListener('keydown', this.atMenuItemEnter());
    // });

    // atMenuItens.forEach(atMenuItem => {
    //   atMenuItem.addEventListener('click', event => {
    //     atMenuItem.addEventListener('keydown', this.atMenuItemEnter());
    //   })
    // })

        // const atMenuElements = document.getElementsByClassName("e-list-item e-level-1");
        // console.log(atMenuElements);


        // if (args.event.key == "Tab") {
        //   this._navigationFieldManager.nextField(true);
        // }
        // console.log('LISTDATA', listData);

        // const selectedItem2222: string = data[0]['name'];
        // console.log(this._listviewInstance.localData[0]);
        // const firstElement = this._listviewInstance.element.getElementsByTagName('name').value = selectedItem;
        // const firstElement = this._listviewInstance.element.getElementsByClassName('e-list-item-header')[0];
        // this._listviewInstance.element.getElementsById('listview_')[0];
        // firstElement.sel

        //   console.log('SELECTED ITEM111', listObj.dataSource[0]);
        // console.log('SELECTED ITEM222', selectedItem);

        // this.actionComplete(selectedItem);

        // listObj.

          // this._listviewInstance.checkBoxPosition = selectedItem;
            // data[0]
        }
    }
    return;
  }


  actionComplete(e: any) {
    // console.log('ACTION COMPLETE', e);

    // const firstElement = this._listviewInstance.element.attributes.item.name.match(e);
    // console.log('FIRST ELEMENT',this._listviewInstance.localData[0].focus);
    // console.log(this._listviewInstance.localData[0].name);
    // console.log(this._listviewInstance.localData.);
    // this._listviewInstance.localData.values();

    if (e.requestType === "beginEdit") {
      // focus the column
      // e.form.elements[this._listviewInstance.element.getAttribute("name")].focus();
      // this._listviewInstance.element.getAttribute("name").focus();
    }
}

}
