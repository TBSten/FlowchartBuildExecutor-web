import Runtime from "./Runtime" ;
import { Variable, } from "./types";

export default class MsgBoxRuntime extends Runtime {
    constructor(flowIds: string[], vars: Variable[]){
        super(flowIds, vars) ;
        this.name = "メッセージボックス" ;
        this.description = "出力をメッセージボックスで行います" ;
    }
    async output(data :string){
        console.log("<<<<<<<<output start");
        const lines = data.split(",").map(el=>this.eval(el).toString());
        for (let line in lines){
            await this.msgBox(this.eval(line).toString());
        }
        console.log("<<<<<<<<output end");
    }
    async input(msg :string) {
        return await this.inputBox(msg);
    }
}
