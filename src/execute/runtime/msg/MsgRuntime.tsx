import { Runtime } from "../Runtime";

export class MsgRuntime extends Runtime {
    name = "msg";
    async output(...data: string[]): Promise<void> {
        await this.showMsgBox(data.join(" "));
    }
    async input(): Promise<string> {
        return prompt("") ?? "";
    }
}


