import { FC } from "react";
import { logger } from "src/lib/logger";
import { MsgRuntime } from "./msg/MsgRuntime";
import { Runtime } from "./Runtime";
import { TerminalRuntime } from "./terminal/TerminalRuntime";


export type RuntimeSettingComponentProps = {
    runtime: Runtime,
}
export type RuntimeSettingComponent = FC<RuntimeSettingComponentProps>;


type RuntimeFactory = () => Runtime;
const runtimes: {
    [key: string]: {
        factory: RuntimeFactory,
        setting: RuntimeSettingComponent,
    };
} = {
    "メッセージボックス": {
        factory: () => new MsgRuntime(),
        setting: () => <></>,
    },
    "ターミナル": {
        factory: () => new TerminalRuntime(),
        setting: () => <></>,
    },
};

export function getRuntime(name: string = "メッセージボックス") {
    logger.log("getRuntime", name)
    return runtimes[name].factory();
}

export function getRuntimeKeys() {
    return Object.keys(runtimes);
}

export function getRuntimeFactories() {
    return Object.values(runtimes).map(runtime => runtime.factory)
}

