import { Runtime } from "./Runtime";


export class TerminalRuntime extends Runtime {
    name = "terminal";
    async output(...data: string[]): Promise<void> {
        await this.showMsgBox(data.join(" "));
    }
    async input(): Promise<string> {
        return prompt("") ?? "";
    }
}


