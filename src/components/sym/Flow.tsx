import { Item, useEditItems } from "atom/syms";
import { ReactNode } from "react";
import styled from "styled-components" ;
import Arrow from "./Arrow";

import {conf} from "components/sym/Sym" ;

const FlowContainer = styled.div`
    /* width: ${conf.width}px ;
    height: ${conf.height}px ; */
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    position: relative;
    width: auto;

`;


export default function Flow(props :{id:number, item :Item }){
    // console.log("Flow render by ",props.item);
    const symIds = props.item.syms?props.item.syms:[] ;
    const {getItem} = useEditItems();
    if(symIds && symIds.length > 0){
        const childrenComp :ReactNode[] = symIds.reduce((p,v,idx)=>{
            const childItem = getItem(v) ;
            if(childItem){
                const ChildComp = childItem.component ;
                p.push(<ChildComp key={idx*2} id={v} item={childItem}/>);
                p.push(<Arrow key={idx*2+1} parentFlowId={props.id} idx={idx} />);
            }else{
                console.log("unvalid child :",childItem," id :",v);
            }
            return p ;
        },[] as ReactNode[]);
        childrenComp.length --;
        console.log("Flow childrenComp",childrenComp);
        return (
            <FlowContainer>
                {
                    childrenComp
                }
            </FlowContainer>
        ) ;
    }else {
        return (
            <FlowContainer>
            </FlowContainer>
        ) ;
    }
}

