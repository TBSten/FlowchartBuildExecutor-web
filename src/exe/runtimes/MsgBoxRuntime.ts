import Runtime from "./Runtime" ;
import { Variable,VariableValue } from "./types";

export default class MsgBoxRuntime extends Runtime {
    constructor(flowIds: string[], vars: Variable[]){
        super(flowIds, vars) ;
        this.name = "メッセージボックス" ;
        this.description = "出力をメッセージボックスで行います" ;
    }
    async output(data :VariableValue){
        console.log("<<<<<<<<output start");
        await this.msgBox(data.toString());
        console.log("<<<<<<<<output end");
    }
    async input(msg :string) {
        return await this.inputBox(msg);
    }
}


