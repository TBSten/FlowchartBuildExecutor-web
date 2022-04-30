import { itemBaseCreator } from "../base/itemBaseCreator";
import optionCreator from "../base/optionCreator";
import { SymCreator } from "../types";

export const terminalStartSymCreator:SymCreator = (itemId,parentItemId)=>{
    const ans = {
        ...itemBaseCreator(itemId,"terminal-start",parentItemId),
        options:[
            optionCreator("テキスト",""),
        ],
    }
    ans.flgs.delete = false ;
    ans.flgs.duplicate = false ;
    return ans ;
} ;

