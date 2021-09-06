import {useGetItem} from "redux/reducers/items" ;
import {Item} from "redux/types/item" ;
// import { Item, useGetItem } from "atom/syms";
import { ReactNode, RefObject, useRef } from "react";
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


interface FlowProps{
    id:string, 
    item :Item, 
    isRound? :boolean , 
}

export default function Flow(props :FlowProps){
    // console.log(props);
    // const {getItem} = useEditItems();
    const getItem = useGetItem();
    const isRound = props.isRound?props.isRound:false ;
    let symIds = props.item.syms?props.item.syms:[] ;
    symIds = symIds.filter(ele=>(getItem(ele) !== null));
    if(symIds && symIds.length > 0){
        const childrenComp :ReactNode[] = symIds.reduce((p,v,idx)=>{
            const childItem = getItem(v) ;
            if(childItem){
                const ChildComp = childItem.component ;
                p.push(<ChildComp key={v} id={v} item={childItem}/>);
                p.push(<Arrow key={v+"-arrow"} parentFlowId={props.id} idx={idx} />);
            }else{
                // console.log("unvalid child :",childItem," id :",v);
            }
            return p ;
        },[] as ReactNode[]);
        if(childrenComp.length > 0){
            childrenComp.length --;
        }
        // console.log("Flow childrenComp",childrenComp,"isRound",isRound,"props",props);
        return (
            <FlowContainer >
                {
                    isRound?
                    <Arrow idx={-1} parentFlowId={props.id} addable={true}/>
                    :
                    ""
                }
                {
                    childrenComp
                }
                {
                    isRound && childrenComp.length > 0?
                    <Arrow idx={childrenComp.length} parentFlowId={props.id} addable={true}/>
                    :
                    ""
                }
            </FlowContainer>
        ) ;
    }else {
        return (
            <FlowContainer>
                <Arrow idx={-1} parentFlowId={props.id} addable={true}/>
            </FlowContainer>
        ) ;
    }
}

