import { FC } from "react";
import { useSelector } from "react-redux";
import { ItemId } from "src/redux/items/types";
import { StoreState } from "src/redux/store";
import { itemTypes } from "../itemTypes";

export type ChildSymProps = {
    itemId:ItemId ;
} ;
const ChildSym :FC<ChildSymProps> = ({itemId})=>{
    const itemType = useSelector((state:StoreState)=>{
        const item = state.items.find(item=>item.itemId === itemId) ;
        if(item){
            return item.itemType ;
        }
        return null ;
    }) ;
    if(!itemType) return <div># ERROR UNVALID SYM</div> ;
    const Sym = itemTypes[itemType].component ;
    return (
        <Sym itemId={itemId} />
    ) ;
} ;
export default ChildSym ;

