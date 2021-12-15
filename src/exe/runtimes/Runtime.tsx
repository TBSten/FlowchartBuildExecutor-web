import { Item } from "redux/types/item";
import { Variable, VariableValue, } from "./types";
import { store } from "redux/store";
import { setExecutingId, } from "redux/reducers/exes";
import { evalFormula } from "util/formulaEval";
import { hideAppDialog, hideAppSnackbar, openAppDialog, openAppSnackbar, setOnCloseAppDialog, setOnCloseAppSnackbar, } from "redux/reducers/app";
import { DialogActions, DialogContent, DialogTitle, Snackbar } from "@material-ui/core";
import { TabData } from "components/App/types";
import ExecuteError from "error/ExecuteError";
import Button from "components/util/Button";
import styled from "styled-components";

const ExeViewCon = styled.div`
  background:white;
  padding:1rem;
  border-radius:0.5rem;
  box-shadow:0 0 5px black;
`;

export type Executable = (
  exe: Runtime,
  item: Item,
  itemId?: string
) => Promise<void>;

export default class Runtime {
  name = "デフォルトのランタイム";
  description = "ランタイムの説明文です。";

  exeItemIds: string[];
  variables: Variable[];
  flowIds: string[];
  status: "waiting" | "doing" | "done";
  tempMemory: { [key: string]: any };
  speed:number;//1-10まで


  isExeAll:boolean;

  constructor(flowIds: string[], vars: Variable[]) {
    this.flowIds = flowIds;
    this.variables = vars;
    this.exeItemIds = [];
    this.status = "waiting";
    this.tempMemory = {};
    this.isExeAll = false ;
    this.speed = 1 ;
  }
  setVar(name: string, value: VariableValue): void {
    const matcher = name.match(/^((.+)\[(.+)\])$/);
    //console.log("matcher", matcher);
    if (!matcher) {
      //変数
      let i = 0;
      for (;i < this.variables.length && this.variables[i].name !== name;i++) {}
      if (i < this.variables.length) {
        //update
        this.variables[i].value = value;
      } else {
        //insert
        this.variables[i] = {
          name,
          value,
        };
      }
    } else {
      //1次元配列
      const arr = matcher[2];
      const idx = this.eval(matcher[3]) as number;
      let i = 0;
      for (
        ;
        i < this.variables.length && this.variables[i].name !== arr;
        i++
      ) {}
      if (i < this.variables.length) {
        const arrV = this.variables[i].value as unknown as any[];
        arrV[idx] = value;
      } else {
        throw new Error("unvalid array :" + arr);
      }
    }
  }
  getVar(name: string): VariableValue | null {
    const refMatcher = name.match(/(.*)\[(.*)\]/);
    if (refMatcher) {
      const vari = refMatcher[1];
      const key = refMatcher[2];
      //console.log("setVar vari:", vari, " key:", key);
      const evKey = this.eval(key);
      let idx = -1;
      this.variables.forEach((e, i) => {
        if (e.name === vari) {
          idx = i;
        }
      });
      if (0 <= idx && typeof evKey === "number") {
        let ans = this.variables[idx].value as unknown;
        if (ans instanceof Array) {
          return ans[evKey];
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      let idx = -1;
      this.variables.forEach((e, i) => {
        if (e.name === name) {
          idx = i;
        }
      });
      if (0 <= idx) {
        return this.variables[idx].value;
      } else {
        return null;
      }
    }
  }
  getItem(id: string) {
    if (id) {
      const state = store.getState();
      const items = state.items;
      return items[id];
    }
  }
  addExeItemId(idx: number, ...itemId: string[]) {
    this.exeItemIds.splice(idx, 0, ...itemId);
  }
  putTemp<V>(key: string, value: V) {
    this.tempMemory[key] = value;
  }
  getTemp<V>(key: string): V {
    return this.tempMemory[key];
  }
  init(): void {
    const flowId = this.flowIds[0];
    this.exeItemIds.push(flowId);
    store.dispatch(setExecutingId("none"));
    this.tempMemory = {};
  }
  async next() {
    if (this.status === "waiting") {
      this.init();
      this.status = "doing";
      this.next();
    } else if (this.status === "doing") {
      if (this.exeItemIds.length >= 1) {
        const exeItemId = this.exeItemIds[0];
        const exeItem = this.getItem(exeItemId);
        this.exeItemIds = this.exeItemIds.slice(1); //先頭削除
        store.dispatch(setExecutingId(exeItemId));
        try {
          if (exeItem) {
            console.log("exe:",exeItem.itemType);
            await exeItem.execute(this, exeItem, exeItemId); //先頭実行
          } else {
            throw new Error("unvalid item " + exeItem + "(" + exeItemId + ")");
          }
        } catch (e ) {
          if(e instanceof ExecuteError){
            console.error(e.displayMessage);
            console.error(e);
            await this.onError(e,e.displayMessage);
          }else{
            console.error(e);
            // alert("エラーが発生しました");
            await this.onError(e as Error,null);
          }
        }
      } else {
        //すでに終了しています
        //console.log("すでに終了しています");
        this.status = "done";
        this.exit();
      }
    } else if (this.status === "done") {
      //console.log("すでに終了しています");
      return;
    } else {
      console.error("status is unvalid :", this.status);
    }
    if(this.isExeAll){
      // let s = 10-this.getSpeed() ;
      // s = s * 300 + 100 ;

      let s = this.getSpeed()*(-1000/9) + 10000/9+1;
      console.log("sleep:",s);
      await this.sleep(s) ;
    }
  }
  async onError(e:Error, displayMessage?:string|null){
    if(displayMessage){
      const text = `${displayMessage}` ;
      // alert(`#エラー : ${displayMessage}`);
      await this.dialog({
        title:"#エラー",
        msg:text
      });
    }else{
      const text = "エラーが発生しましたが原因が分かりません。FBE開発チームに問い合わせてください。" ;
      // alert("#不明なエラー : エラーが発生しましたが原因が分かりません。FBE開発チームに問い合わせてください。");
      await this.dialog({
        title:"#不明なエラー",
        msg:text,
      });
    }
  }
  async exeAll(){
    this.isExeAll = true ;
    while(!this.isExited()){
      console.log("^^^^^^^^^^ exeAll");
      await this.next() ;
    }
    this.next() ;
  }

  stop() {
    if(this.status !== "done"){
      this.status = "done" ;
    }else{
      //すでに終了している
    }
  }
  async exit() {
    store.dispatch(setExecutingId("none"));
    store.dispatch(hideAppSnackbar());
    await this.dialog({
      title:"実行終了",
      msg: "終了しました",
    });
  }
  isExited() :boolean{
    if(this.status === "done"){
      return true ;
    }
    if(this.status === "waiting"){
      return false ;
    }
    if(this.status === "doing"){
      if(this.exeItemIds.length >= 1){
        return false ;
      }else{
        return true ;
      }
    }
    throw new Error("unknown error !") ;
  }
  async input(msg: string): Promise<VariableValue | null> {
    //console.log("input ", msg);
    return "";
  }
  async output(data: string):Promise<void> {
    //console.log("output ", data);
  }
  msgBox(msg: string){
    return new Promise<void>((resolve,reject)=>{
      // const onCloseAction = setOnCloseAppDialog(()=>{
      //   console.log("close");
      //   resolve();
      // });
      // const hideAction = hideAppDialog() ;
      // const openAction = openAppDialog(
      //   <>
      //     <DialogTitle>{title}</DialogTitle>
      //     <DialogContent>
      //       <div>{msg}</div>
      //     </DialogContent>
      //     <DialogActions>
      //       <Button onClick={()=>{store.dispatch(hideAction );console.log("hide app dialog")}}>
      //         閉じる
      //       </Button>
      //     </DialogActions>
      //   </>
      // ) ;
      // store.dispatch(onCloseAction);
      // store.dispatch(openAction);

      //専用のメッセージボックスで表示
      store.dispatch(setOnCloseAppSnackbar(()=>{
        hideAppSnackbar();
      }));
      store.dispatch(openAppSnackbar(
        msg
      ));
      setTimeout(()=>{
        const state = store.getState();
        if(state.app.snackbar.content === msg){
          store.dispatch(hideAppSnackbar());
        }
      },Math.min(msg.length*900,8*1000));
      resolve();
    });
  }
  async dialog({title,msg}:{title?:string,msg:string}){
      const onCloseAction = setOnCloseAppDialog(()=>{
        console.log("close");
        Promise.resolve();
      });
      const hideAction = hideAppDialog() ;
      const openAction = openAppDialog(
        <>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <div>{msg}</div>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>{store.dispatch(hideAction );console.log("hide app dialog")}}>
              閉じる
            </Button>
          </DialogActions>
        </>
      ) ;
      store.dispatch(onCloseAction);
      store.dispatch(openAction);
  }
  sleep(msec :number){
    return new Promise<void>((resolve,reject)=>{
      if(msec > 0){
        setTimeout(()=>{
          resolve();
        },msec);
      }else{
        resolve() ;
      }
    }) ;
  }
  inputBox(msg: string = "入力") {
    return new Promise<string|null>((resolve,reject)=>{
      const ans = window.prompt(msg) ;
      resolve(ans);
    });
  }
  // async inputBox(msg: string = "入力"){
  //   return window.prompt(msg);
  // }
  getProcesses() {
    const ans: { [key: string]: string } = {};
    this.flowIds.forEach((el) => {
      const flow = this.getItem(el);
      if (flow && flow.syms) {
        const startSymId = flow.syms[0];
        const startSym = this.getItem(startSymId);
        if (startSym && startSym.options[1].name === "はじめのテキスト") {
          const processName = startSym.options[1].value;
          ans[processName] = el;
        } else {
          throw new Error("unvalid item " + flow + " as a flow");
        }
      } else {
        throw new Error("unvalid flow " + flow);
      }
    });
    return ans;
  }

  eval(formula: string) {
    // const evaler = new Evaler(this.variables);
    // const ans = evaler.eval(formula);
    // return ans;
    return evalFormula(
      formula,
      this.variables
    );
  }

  getTabs() :TabData[]{
    const ans :TabData[] = [
      {
        label:"TEST",
        comp:(
          <div>
            TestTab
          </div>
        ),
      },
    ] ;
    return ans ;
  }

  getSpeed(){
    return this.speed ;
  }
  setSpeed(speed:number){
    if(1<=speed && speed<=10){
      this.speed = speed ;
    }else{
      throw new Error("unvalid runtime speed :"+speed) ;
    }
  }

}
