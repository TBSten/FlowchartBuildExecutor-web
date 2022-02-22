
import { flowExecute } from "./flow/execute";
import { symTypes } from "./symTypes";
import { ItemExecute } from "./types";

/**
 * ### usage
 * ```tsx
 * const someItem = ... ;
 * const execute = executes[someItem.itemType];
 * execute({items:someItem,runtimeData,runtime})
 * ```
 */
const executes: {
    [key: string]: ItemExecute
} = Object.entries(symTypes).reduce((ans, [type, { execute }]) => {
    ans[type] = execute;
    return ans;
}, {} as {
    [key: string]: ItemExecute
});
executes["flow"] = flowExecute;


console.log(executes)

export default executes;

