import { MsgRuntime } from "./MsgRuntime";
import { Runtime } from "./Runtime";
import { TerminalRuntime } from "./TerminalRuntime";

const runtimeFactories: {
    [key: string]: () => Runtime;
} = {
    "メッセージボックス": () => new MsgRuntime(),
    "ターミナル": () => new TerminalRuntime(),
    // "for test": () => new TestRuntime(),
};


// export function getRuntimes(){
//     return runtimeFas ;
// }


export function getRuntime(name: string = "メッセージボックス") {
    console.log("getRuntime", name)
    return runtimeFactories[name]();
}

export function getRuntimeKeys() {
    return Object.keys(runtimeFactories);
}

export function getRuntimeFactories() {
    return Object.values(runtimeFactories)
}

