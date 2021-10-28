import { useGetItem, useGetItemOption } from "redux/reducers/items";
import { Item } from "redux/types/item";
import Sym, { SymRender } from "./Sym";
import styled from "styled-components" ;
import { useRef, useEffect } from "react";
import {conf} from "components/sym/Sym" ;
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
const Space = styled.div`
    width: 100%;
    height: ${conf.height/2}px;
`;
const Canvas = styled.canvas`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
`;

interface BranchSymProps{
    id :string; 
    item :Item;
    isTagShow? :boolean;
    isYesNo? :boolean;
}

export default function BranchSym({id, item, isTagShow=true, isYesNo=false}: BranchSymProps){
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const symsRefs = useRef<HTMLElement[]>([]);
    const arrowRender = ()=>{
        console.log("symsRefs",symsRefs);
        // console.log(symsRefs);
        const con = containerRef.current ;  //container
        const can = canvasRef.current ;     //canvas
        const ctx = can?.getContext("2d");
        const syms = symsRefs.current ;     //children
        // console.log(syms);
        if(con && can && ctx){
            can.width = con.offsetWidth ;
            can.height = con.offsetHeight ;
            ctx.clearRect(0,0,can.width,can.height);
            ctx.lineWidth = conf.lineWidth ;
            ctx.strokeStyle = conf.baseForeC ;
            console.log("symsArrow",syms);
            syms.forEach((ele)=>{
                const x = conf.width/2 ;//ele.offsetLeft
                const y = conf.height/2 ;
                const w = ele.offsetLeft ;
                const h = ele.offsetTop+ele.offsetHeight-y;
                ctx.strokeRect(x,y,w,h);
                console.log("stroke",x,y,w,h);
            }) ;
            ctx.beginPath();
            ctx.moveTo(conf.width/2, conf.height/2);
            ctx.lineTo(conf.width/2, con.offsetHeight);
            ctx.stroke();
        }

    }
    useEffect(arrowRender,[]);
    useEffect(arrowRender);
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
    const symsItems = item.syms?.map((ele,idx)=>{
        const item = getItem(ele);
        if(item){
            return (
                <item.component 
                    id={ele} 
                    item={item} 
                    isRound={true} 
                    key={ele} 
                    ref={(el:HTMLElement)=> symsRefs.current[idx] = el } 
                    isTagShow={isTagShow}
                    tag={isYesNo ? (idx===0?"Yes":idx===1?"No":"#ERROR !") : null}/> 
            );
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
            {/* 子要素のタグの出力 */}

            {/* 子要素の出力 */}
            <ChildContainer>
                {symsItems}
            </ChildContainer>
            {/* 下の空白 */}
            <Space />
            {/* 矢印の出力 */}
            <Canvas ref={canvasRef}/>
        </BranchContainer>
    )
} ;

