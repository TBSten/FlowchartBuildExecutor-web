import {useGetItem} from "redux/items/hooks" ;
import {selectItemById} from "redux/app/actions" ;
import {Item} from "redux/types/item" ;
// import { Item, useGetItem } from "atom/syms";
import { ForwardedRef, ReactNode, useEffect, } from "react";
import styled from "styled-components" ;
import Arrow from "./Arrow";

import {conf} from "components/sym/Sym" ;
import React from "react";
import { useDispatch } from "react-redux";

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
const TagContainer = styled.div`
    width: 100%;
    z-index: 10000;
    text-align: left;
`;


interface FlowProps{
    id:string;
    item :Item;
    isRound? :boolean ;
    isTagShow? :boolean;
    tag? :string;
}

export default React.forwardRef(
    function Flow(props :FlowProps, ref:ForwardedRef<HTMLDivElement> ){
        const getItem = useGetItem();
        const dispatch = useDispatch() ;
        const isRound = props.isRound?props.isRound:false ;
        const isTagShow = props.isTagShow? props.isTagShow : false;
        let symIds = props.item.syms?props.item.syms:[] ;
        symIds = symIds.filter(ele=>(getItem(ele) !== null));
        const tag = props.tag ? props.tag : props.item.options[0].value ;
        function handleSelectFlow(){
            // console.log("handleSelectFlow",props.id);
            console.log("handleSelectFlow",props.id);
            if(!props.tag && isTagShow){
                dispatch(selectItemById(props.id));
            }
        }
        useEffect(()=>{
            console.log("flow item changed :",props.item);
        },[props.item]);
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
            // tag = props.tag ? props.tag : props.item.options[0].value ;
            return (
                <FlowContainer ref={ref}>
                    {/* タグの出力 */}
                    {
                        isTagShow?
                        <TagContainer onClick={handleSelectFlow}>
                            {tag}
                        </TagContainer>
                        :
                        ""
                    }
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
                <FlowContainer ref={ref}>
                    {/* タグの出力 */}
                    {
                        isTagShow?
                        <TagContainer onClick={handleSelectFlow}>
                            {tag}
                        </TagContainer>
                        :
                        ""
                    }
                    <Arrow idx={-1} parentFlowId={props.id} addable={true}/>
                </FlowContainer>
            ) ;
        }
    }
);
