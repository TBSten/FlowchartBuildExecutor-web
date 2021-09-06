import {useTopFlows} from "redux/reducers/top" ; 
import {useGetItem} from "redux/reducers/items" ; 
// import { useGetItem, useTopFlows } from "atom/syms";
import styled from "styled-components" ;
import {sp} from "./css/media" ;

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

    ${sp`
        transform: scale(0.7);
        transform-origin: left top ;
    `}
`;


export default function BuildPane(){
    console.log("BuildPane");
    // const {
    //     topFlows,
    //     getItem,
    // } = useEditItems() ;
    const topFlows = useTopFlows();
    const getItem = useGetItem();

    const memodChild = (
        <FlowContainer>
            {
                topFlows.map((ele,idx)=>{
                    const item = getItem(ele) ;
                    if(item){
                        const Ele = item.component ;
                        return <Ele id={ele} item={item} key={idx}/>
                    }else{
                        return null ;
                    }
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

