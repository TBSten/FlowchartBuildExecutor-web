import { useGetItem, useGetItemOption } from "redux/reducers/items";
import { Item } from "redux/types/item";
import Sym, { SymRender } from "./Sym";
import styled from "styled-components" ;
import { useRef, useEffect } from "react";
import React from "react";

const BranchContainer = styled.div`
    position: relative;
`;
const TopContainer = styled.div`
    width: 100%;
    display:grid;
    grid-template-columns: auto 1fr;
    position:relative;
`;
const OutCon = styled.div`
    position:absolute;
    left:180px;
    top:0;
    height:40px;
    display:flex;
    justify-content: center;
    align-items: flex-end;
    text-align:center;
`;
const ChildContainer = styled.div`
    /* display: flex;
    flex-direction: row;
    justify-content:flex-start; */
    display:grid;
    gap: 10px;
    grid-template-rows: auto;
    /* background:red; */
    grid-auto-flow: column;
`;
const Canvas = styled.canvas`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
`;

export default function BranchSym({id, item}: {id:string, item:Item}){
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    console.log(containerRef);
    console.log(canvasRef);
    const arrowRender = ()=>{
        const con = containerRef.current ;
        const can = canvasRef.current ;
        const ctx = can?.getContext("2d");
        if(con && can && ctx){
            can.width = con.offsetWidth ;
            can.height = con.offsetHeight ;
            const lw = 1 ;
            ctx.lineWidth = lw ;
            ctx.strokeStyle = "#020249" ;
            ctx.strokeRect(0+lw/2,0+lw/2,50,50);
        }

    }
    useEffect(arrowRender,[]);
    arrowRender();
    const getItem = useGetItem();
    const getItemOption = useGetItemOption() ;
    const topRender :SymRender = (ctx,w,h,lw)=>{
        ctx.beginPath();
        ctx.moveTo(w/2,lw/2);
        ctx.lineTo(w-lw/2,h/2);
        ctx.lineTo(w/2,h-lw/2);
        ctx.lineTo(lw/2,h/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

    };
    const symsItems = item.syms?.map(ele=>{
        const item = getItem(ele);
        if(item){
            return <item.component id={ele} item={item} isRound={true}/> ;
        }else{
            return <>ERROR id:{ele}は不正です</> ;
        }
    });
    const outCon = getItemOption(id,"記号外に表示する") ;
    return(
        <BranchContainer id={id} ref={containerRef}>
            <TopContainer>
                <Sym id={id} render={topRender}>
                    {
                        outCon?.value?
                        "※"
                        :
                        getItemOption(id,"条件")?.value
                    }
                </Sym>
                <OutCon>
                    <div>
                    {
                        outCon?.value?
                        "※ "+getItemOption(id,"条件")?.value
                        :
                        ""
                    }
                    </div>
                </OutCon>
            </TopContainer>
            {/* 子要素の出力 */}
            <ChildContainer>
                {symsItems}
            </ChildContainer>
            {/* 矢印の出力 */}
            <Canvas ref={canvasRef}/>
            {/* <div ref={el => console.log("test ref",el)}>TEST</div> */}
        </BranchContainer>
    )
} ;

