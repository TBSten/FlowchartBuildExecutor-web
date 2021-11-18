import {useDispatch} from "react-redux" ;
import {useTopFlows} from "redux/reducers/top" ; 
import {useGetItem} from "redux/reducers/items" ; 
// import { useGetItem, useTopFlows } from "atom/syms";
import styled from "styled-components" ;
import {sp} from "./css/media" ;
import { useZoom } from "redux/reducers/edits";
import { selectItemById,useSelectItemIds } from "redux/reducers/selectItem" ;
import SelectAllIcon from '@material-ui/icons/SelectAll';
import { assignLoopCnt, } from "components/sym/WhileSym" ;


const FlowContainer = styled.div`
    display:inline-grid;
    grid-auto-flow:column;
    grid-template-rows: 1fr;
    gap: 1rem;
    
    padding: 180px;
    width:auto;
    transform-origin: left top ;

    ${sp`
        transform: scale(0.7);
        transform-origin: left top ;
    `}
`;


export default function BuildPane(){
    // console.log("BuildPane");
    const topFlows = useTopFlows();
    const getItem = useGetItem();
    const zoom = useZoom();
    const dispatch = useDispatch() ;
    const selectItemIds = useSelectItemIds() ;
    assignLoopCnt();
    

    const memodChild = (
        <FlowContainer 
            style={{transform:`scale(${zoom})`}} 
            id="fbe-buildpane" >
            {
                topFlows.map((ele,idx)=>{
                    const item = getItem(ele) ;
                    if(item){
                        const Ele = item.component ;
                        const handleClick = ()=>{
                            dispatch(selectItemById(ele));
                        } ;
                        const isSelect = selectItemIds && selectItemIds.includes(ele) ;
                        return (
                            <div key={idx}>
                                <div style={{display:"flex"}} onClick={handleClick}> 
                                    <SelectAllIcon color={isSelect?"primary":undefined}/> 
                                </div>
                                <div style={isSelect?{border:"solid 1px blue",borderRadius:"10px"}:{border:"solid 1px rgba(0,0,0,0)"}}>
                                    <Ele id={ele} item={item} key={idx}/>
                                </div>
                            </div>
                        ) 
                    }else{
                        console.log("warning flow :",item);
                        return <div key={idx}># error ! </div> ;
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

