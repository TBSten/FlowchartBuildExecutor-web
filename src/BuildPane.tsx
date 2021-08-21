
import { useEditItems } from "atom/syms";
import { useMemo } from "react";
// import { useEffect, useRef } from "react";
import styled from "styled-components" ;

const FlowContainer = styled.div`
    /* overflow:auto; */
    display: inline-flex;
    flex-direction:row;
    justify-content:flex-start;
    align-items: flex-start;
    flex-wrap:wrap;
    background: none;

    flex-grow:1;

    
    padding: 180px;
    width:auto;
`;


export default function BuildPane(){
    const {
        items,
        topFlows,
        getItem,
    } = useEditItems() ;
    console.log(getItem(topFlows[0]));
    topFlows.forEach(ele=>{
        console.log( "BuildPane flows :" , getItem(ele) );
    });
    console.log("items :",items);

    const memodChild = (
        <FlowContainer>
            {
                topFlows.map((ele,idx)=>{
                    const item = getItem(ele) ;
                    const Ele = item.component ;
                    return <Ele id={ele} item={item} key={idx}/>
                })
            }
        </FlowContainer>
    );
    
    return (
        // <FlowContainer>
        //     {
        //         topFlows.map((ele,idx)=>{
        //         const item = getItem(ele) ;
        //         const Ele = item.component ;
        //         return <Ele id={ele} item={item} key={idx}/>
        //         })
        //     }
        // </FlowContainer>
        memodChild
    ) ;
};

