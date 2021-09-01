import styled from "styled-components" ;
import { useRef, useState,  } from "react";
// import { useAddItem, useMode, useAddSymToFlow,useEditItems } from "atom/syms";
import AddIcon from "@material-ui/icons/Add" ;
import IconButton from "@material-ui/core/IconButton" ;
import Drawer from "@material-ui/core/Drawer" ;
import List from "@material-ui/core/List" ;
import ListItem from "@material-ui/core/ListItem" ;
import ListItemText from "@material-ui/core/ListItemText" ;
import Tooltip from '@material-ui/core/Tooltip';

import {conf} from "./Sym" ;
import { makeStyles } from "@material-ui/styles";
import itemCreator, { calcSymCreator } from "util/itemCreator";
import { useDispatch } from "react-redux";
import { addItem,setItem,removeItem } from "redux/reducers/items";
import { useGetItem } from "redux/reducers/items";
import { Item } from "redux/types/item";
import { randomStr } from "util/functions";
// import itemCreators,{AddItemFunction, ItemCreator} from "../../util/itemCreator" ;


const ArrowContainer = styled.div`
    width: ${conf.width}px;
    height: ${conf.height/2}px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`;
const useStyles = makeStyles({
    root: {
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        zIndex: 10000,
    },
});

interface ArrowProps{
    parentFlowId? :string,
    idx? :number,
    addable? :boolean,
}

export default function Arrow({idx,parentFlowId,addable=true}: ArrowProps){
    // const mode = useMode();
    // const addItem = useAddItem();
    // const addSymToFlow = useAddSymToFlow();
    const classes = useStyles();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const canvasRef = useRef<HTMLCanvasElement>(null);
    if(canvasRef?.current){
        const canvas = canvasRef.current ;
        const ctx = canvas.getContext("2d") ;
        if(ctx){
            ctx.fillStyle = conf.baseBackC ;
            ctx.strokeStyle = conf.baseForeC ;
            ctx.lineWidth = conf.lineWidth ;
            const w = canvas.width ;
            const h = canvas.height ;
            ctx.clearRect(0,0,w,h);
            ctx.beginPath();
            ctx.moveTo(w/2,0);
            ctx.lineTo(w/2,h);
            ctx.stroke();
            ctx.closePath();
        }
    }
    const dispatch = useDispatch();
    const getItem = useGetItem();
    const handleClick = ()=>{
        // console.log(itemCreators);
        // if(addable && (parentFlowId )){
        //     // if(idx || idx === 0){
        //     //     const newItem = calcSymCreator() ;
        //     //     const newSymId = addItem(newItem) ;
        //     //     addSymToFlow(parentFlowId, idx+1, newSymId);
        //     // }
        //     setIsDrawerOpen(true);
        // }
        if(addable && parentFlowId){
            setIsDrawerOpen(true);
        }
    }
    const creators = itemCreator.map(ele=>(
        ele.creator()
    ));
    const handleAddItem = (i :number)=> (()=>{
        if(addable && parentFlowId && (idx||idx===0)){
            // const sym = creators[i]() ;
            // const id = "Flow-"+randomStr(32) ;  //親flowの
            // dispatch(setItem(id,sym));
            // const flow = getItem(parentFlowId);
            // const newFlow = Object.assign({},flow);
            // //----------newFlow.syms に idxの位置で idを追加
            // let newSyms = newFlow.syms?.splice(idx+1, 0, id);
            // newFlow.syms = newSyms ;
            // console.log("newFlow ",flow,newFlow);
            // dispatch(setItem(parentFlowId,newFlow));
            // setIsDrawerOpen(false);
            // console.log("add by Arrow ||||| ",parentFlowId,newFlow,idx);
            const sym :Item = creators[i]();
            const symId = "Item-"+randomStr(32) ;
            dispatch(setItem(symId,sym));
            const parentFlow = getItem(parentFlowId);
            const newParentFlow :Item = Object.assign({},parentFlow);
            newParentFlow.syms?.splice(idx+1,0,symId);
            dispatch(setItem(parentFlowId, newParentFlow));
            setIsDrawerOpen(false);
        }
    }) ;
    const handleCloseDrawer = ()=>{
        setIsDrawerOpen(false);
    } ;   
    const mode = "edit" ;
    return (
        <ArrowContainer>
            {
                mode === "edit"?
                    <div className={classes.root} >
                        <IconButton onClick={handleClick}>
                            <AddIcon /> 
                        </IconButton>
                    </div>
                :
                mode === "exe"?
                    <canvas width={conf.width} height={conf.height/2} ref={canvasRef}/>
                :
                    "# Error: unvalid mode :"+mode                
            }
            <Drawer anchor="bottom" open={isDrawerOpen} style={{zIndex:10001}} onClose={handleCloseDrawer}>
                <List>{
                    itemCreator.map((ele,idx)=>(
                        <Tooltip title={ele.description} key={ele.name}>
                            <ListItem button onClick={handleAddItem(idx)}>
                                {/* <h6>{ele.name}</h6>
                                {ele.description} */}
                                <ListItemText primary={ele.name} />
                            </ListItem>
                        </Tooltip>
                    ))
                }</List>
            </Drawer>
        </ArrowContainer>
    ) ;
}


