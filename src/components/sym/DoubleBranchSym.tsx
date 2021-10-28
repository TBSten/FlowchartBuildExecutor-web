import { Item, } from "redux/types/item" ;
import BranchSym from "./BranchSym";

export default function DoubleBranchSym({id, item}: {id:string, item:Item}){
    return (
        <BranchSym id={id} item={item} isYesNo={true} isTagShow={true}/>
    ) ;
}
