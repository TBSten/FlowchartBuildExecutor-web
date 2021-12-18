import { store } from "redux/store";
import { Item, Items } from "redux/types/item";
import { loadItems } from "redux/reducers/items";
import { loadTop } from "redux/reducers/top";
// import {
//   calcSymCreator,
//   terminalSymCreator,
//   flowCreator,
//   whileSymCreator,
//   doubleBranchSymCreator,
//   switchBranchSymCreator,
//   dataSymCreator,
//   prepareSymCreator,
//   processSymCreator,
//   forSymCreator,
// } from "./itemCreator";
import { calcSymCreator } from "item/creator/calc" ;
import { terminalSymCreator } from "item/creator/terminal" ;
import { flowCreator } from "item/creator/flow" ;
import { whileSymCreator } from "item/creator/while" ;
import { doubleBranchSymCreator } from "item/creator/doubleBranch" ;
import { switchBranchSymCreator } from "item/creator/switchBranch" ;
import { dataSymCreator } from "item/creator/data" ;
import { prepareSymCreator } from "item/creator/prepare" ;
import { processSymCreator } from "item/creator/process" ;
import { forSymCreator } from "item/creator/for" ;
import { optionTypes } from "./syms";

import StoreJs from "store";
import { ArrayTemplates } from "redux/types/top";
import { openAppSnackbar,hideAppSnackbar } from "redux/reducers/app" ;

export type OutputOption = {
  name: string;
  value: any;
  type: string;
  args: any;
};
export type OutputItem = {
  itemType: string;
  options: OutputOption[];
  syms: string[];
};
export type OutputItems = {
  [key: string]: OutputItem;
};
export type SaveState = {
  items: OutputItems;
  top: {
    version:string;
    title:string;
    flows: string[];
    arrayTemplates: ArrayTemplates,
  };
};

export function getSaveState(): SaveState {
  const state = store.getState();
  const items: OutputItems = {};
  Object.keys(state.items).forEach((el) => {
    const item = state.items[el];
    // console.log("********", item);
    const options = item.options.map((op) => {
      return {
        name: op.name,
        value: op.value,
        type: op.type.name,
        args: op.args,
      };
    });
    items[el] = {
      itemType: item.itemType,
      options,
      syms: item.syms ? item.syms : [],
    };
  });
  const top = {
    version:"1.0.0",
    title: state.top.title,
    flows: state.top.flows,
    arrayTemplates: state.top.arrayTemplates,
  };
  return {
    items,
    top,
  };
}

export function loadSaveState(saveState: SaveState) {
  //items
  const items: Items = {};
  Object.keys(saveState.items).forEach((el) => {
    const item = saveState.items[el];
    // items[el] = {};
    let put:Item|null = null;
    if (item.itemType === "Calc") {
      put = calcSymCreator();
    } else if (item.itemType === "Terminal") {
      put = terminalSymCreator();
    } else if (item.itemType === "Flow") {
      put = flowCreator();
    } else if (item.itemType === "While") {
      put = whileSymCreator();
    } else if (item.itemType === "DoubleBranch") {
      put = doubleBranchSymCreator();
    } else if (item.itemType === "SwitchBranch") {
      put = switchBranchSymCreator();
    } else if (item.itemType === "Data") {
      put = dataSymCreator();
    } else if (item.itemType === "Prepare") {
      put = prepareSymCreator();
    } else if (item.itemType === "Process") {
      put = processSymCreator();
    } else if (item.itemType === "For") {
      put = forSymCreator();
    }else {
      throw new Error("unvalid type :" + item.itemType);
    }
    const work = put ;
    // console.log("load option ",work);
    put.syms = item.syms;
    put.options = item.options.map((el,idx) => {
      const type = optionTypes[el.type];
      const ansOption = {
        ...work.options[idx],
        ...el,
        type,
      };
      return ansOption ;
    });
    put = work ;
    items[el] = put;
  });
  //top
  const top = saveState.top;
  // console.log("load", items, top);
  store.dispatch(loadItems(items));
  store.dispatch(loadTop(top));
}


export function downloadTextFile(name: string, data: string) {
  const $a = document.createElement("a");
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const txt = new Blob([bom, data], { type: "text/plain" });
  $a.href = URL.createObjectURL(txt);
  $a.download = name;
  $a.click();
}

export function inputTextFile() {
  return new Promise<string>((resolve, reject) => {
    const inputer = document.createElement("input");
    inputer.type = "file";
    inputer.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      // console.log(target.files);
      if (target.files) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            //reader.result
            resolve(reader.result);
          } else {
            reject(
              "unvalid file type :" + typeof reader.result + reader.result
            );
          }
        };
        reader.readAsText(file);
      }
    };
    inputer.click();
  });
}

//ブラウザ
const BROWSER_SAVEDATA_KEY = "fbe-save-temp";
export function saveBrowserSaveData() {
  store.dispatch(openAppSnackbar(
    <>保存中</>
  ));
  const saveData = getSaveState() ;
  StoreJs.set(BROWSER_SAVEDATA_KEY, saveData);
  setTimeout(()=>{
    store.dispatch(hideAppSnackbar());
  },3000);
}
export function loadBrowserSaveData() {
  const saveData = StoreJs.get(BROWSER_SAVEDATA_KEY) as SaveState;
  if (saveData) {
    loadSaveState(saveData);
  }
}
export function clearBrowserSave() {
  StoreJs.set(BROWSER_SAVEDATA_KEY, null);
}

//ダウンロード・アップロード
export function downloadSaveState(){
  const state = store.getState();
  const name = `${state.top.title}.fbe` ;
  const data = getSaveState() ;
  downloadTextFile(name, JSON.stringify(data)) ;
}
export async function loadSaveStateFromLocalFile(){
  const saveState = await inputTextFile();
  loadSaveState(JSON.parse(saveState));
}

//参照のないアイテムを削除したアイテム一覧を返す
export function declutterItems(items :Items){
  let requireItemIds = [] as string[] ;
  // const oldItems = store.getState().items ;
  const oldItems = items ;
  const flows = store.getState().top.flows ;
  //アイテムIDのリスト作成
  // symsを登録
  Object.keys(oldItems).forEach(itemId => {
      const item = oldItems[itemId] ;
      let ids = [] as string[] ;
      //item.syms
      if(item.syms){
          ids = [...ids, ...item.syms] ;
      }
      requireItemIds.push(...ids) ;
  });
  // flowsを登録
  requireItemIds.push(...flows);
  //requireItemIds から Object.keys(oldItems) にないものを削除
  const oldItemIds = Object.keys(oldItems) ;
  requireItemIds = requireItemIds.filter((el)=> oldItemIds.includes(el));
  //requireItemIdsからrequireItemsを作成
  let requireItems = requireItemIds.reduce((p,v)=>{
      p[v] = oldItems[v] ;
      return p ;
  },{} as Items) ;
  //存在しないsymsを削除
  requireItems = Object.entries(requireItems).reduce((p,[id,item])=>{
    const newItem = {...item} ;
    if(newItem.syms){
      newItem.syms = newItem.syms.reduce((p,v)=>{
        if(requireItemIds.includes(v)){
          p.push(v);
        }
        return p ;
      },[] as string[]) ;
    }
    p[id] = newItem;
    return p ;
  },{} as Items);
  // console.log(requireItems);
  // store.dispatch(loadItems(requireItems)) ;
  return requireItems ;
} ;

