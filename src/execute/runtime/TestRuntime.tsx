import { Runtime } from "./Runtime";

export class TestRuntime extends Runtime {
    output(...data: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    input(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    name = "test";
}


