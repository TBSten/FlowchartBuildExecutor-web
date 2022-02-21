import { itemBaseCreator } from "../base/itemBaseCreator";
import optionCreator from "../base/optionCreator";
import { SymCreator } from "../types";

export const terminalStartSymCreator:SymCreator = (itemId,parentItemId)=>({
    ...itemBaseCreator(itemId,"terminal-start",parentItemId),
    options:[
        optionCreator("テキスト",""),
    ],
}) ;

