import { storeStateToSaveFormat } from "src/format";
import { FBE_TO_PROGRAM_URL } from "./constants";
import { logger } from "./logger";
import { notImplementError } from "./notImplement";


export const enableTargets = [
    "javascript",
    "python",
] as const;
export type EnableTarget = typeof enableTargets[number];
export function fbeToProgram(target: typeof enableTargets[number]) {
    return new Promise<string>(async (resolve, reject) => {
        const saveFormat = storeStateToSaveFormat();
        const result = await fetch(FBE_TO_PROGRAM_URL, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                target,
                fbe: saveFormat,
            }),
        }).then(r => r.json()).then(json => {
            return json?.result;
        })
            // .catch(e => { throw Error("invalid fetch result") })
            .catch(e => {
                logger.error("failed fbe to program")
                logger.error(e)
                reject(e);
            });
        if (typeof result !== "string") reject(notImplementError(`invalid result ${result}`));
        resolve(result)
    })
}
export function useFbeToProgram() {
    return ((...args: Parameters<typeof fbeToProgram>) => {
        return fbeToProgram(...args)
    });
}
