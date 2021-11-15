import { Item } from "redux/types/item" ;
import Sym,{SymRender} from "components/sym/Sym" ;
import {useGetItem} from "redux/reducers/items" ;
import { useLoopCnt } from "./WhileSym";
import styled from "styled-components" ;

const ForContent = styled.div`
    line-height: 0.95em;
    display: block;
    padding: 4px;
`;
const LeftAlign = styled.div`
    display:flex;
    flex-direction:column;
    align-items:flex-start;
`;

export default function ForSym({id,item} :{id:string,item:Item}){
    const variable = item.options[0].value ;
    const first = item.options[1].value ;
    const condition = item.options[2].value ;
    const increment = item.options[3].value ;
    // const type = item.options[4].value ;

    const renderForTop :SymRender = (ctx,w,h,lw)=>{
        const base = 10 ;
        ctx.beginPath();
        ctx.moveTo(base,0+lw/2);
        ctx.lineTo(w-base,0+lw/2);
        ctx.lineTo(w-lw/2,base);
        ctx.lineTo(w-lw/2,h-lw/2);
        ctx.lineTo(0+lw/2,h-lw/2);
        ctx.lineTo(0+lw/2,base);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    const renderForBottom :SymRender = (ctx,w,h,lw)=>{
        // ctx.fillRect(0,0,w,h);
        // ctx.strokeRect(lw/2,lw/2, w-lw,h-lw);
        const base = 10 ;
        ctx.beginPath();
        ctx.moveTo(lw/2,lw/2);
        ctx.lineTo(w-lw/2,lw/2);
        ctx.lineTo(w-lw/2,h-base);
        ctx.lineTo(w-base,h-lw/2);
        ctx.lineTo(base,h-lw/2);
        ctx.lineTo(lw/2,h-base);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    const getItem = useGetItem() ;
    let ChildrenComp = <div># ERROR </div> ;
    if(item?.syms && item.syms[0]){
        const flowItem = getItem(item.syms[0]) ;
        if(flowItem){
            ChildrenComp = <flowItem.component id={item.syms[0]} item={flowItem} isRound={true}/>
        }
    }
    const conditionText = <>
        <span>{variable}</span> を 
        <span>{first}</span> から 
        <span>{increment}</span> ずつ増やしながら 
        <span>{condition}</span> の間
    </> ;
    const loopCnt = useLoopCnt() ;
    const loopName = `ループ${loopCnt}` ;
    return (
        // <Sym render={()=>{}} id={id} autoSize={false}>
            <LeftAlign>
                <Sym render={renderForTop} id={id} autoSize={true}>
                    <ForContent>
                        <div>
                            { loopName } 
                        </div>
                        {/* { type === "前判定" ? conditionText : ""} */}
                        { conditionText }
                    </ForContent>
                </Sym>
                { ChildrenComp }
                <Sym render={renderForBottom} id={id} autoSize={true}>
                    <ForContent>
                        <div>
                            { loopName } 
                        </div>
                        {/* { type === "後判定" ? conditionText : ""} */}
                    </ForContent>
                </Sym>
            </LeftAlign>
        // </Sym>
    ) ;
}

