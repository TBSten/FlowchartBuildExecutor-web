import styled from "styled-components" ;
import { useRef, useState,  } from "react";
import { useAddItem, useMode, useAddSymToFlow,useEditItems } from "atom/syms";
import AddIcon from "@material-ui/icons/Add" ;
import IconButton from "@material-ui/core/IconButton" ;
import Drawer from "@material-ui/core/Drawer" ;

import {conf} from "./Sym" ;
import { makeStyles } from "@material-ui/styles";
import itemCreators,{AddItemFunction, ItemCreator} from "../../util/itemCreator" ;


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
    const mode = useMode();
    const addItem = useAddItem();
    const addSymToFlow = useAddSymToFlow();
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
    const handleClick = ()=>{
        console.log(itemCreators);
        if(addable && (parentFlowId )){
            // if(idx || idx === 0){
            //     const newItem = calcSymCreator() ;
            //     const newSymId = addItem(newItem) ;
            //     addSymToFlow(parentFlowId, idx+1, newSymId);
            // }
            setIsDrawerOpen(true);
        }
    }
    const addItemFunctions :AddItemFunction[] = itemCreators.reduce((p,n)=>{
        p.push(n.creator());
        return p ;
    },[] as AddItemFunction[]);
    const handleAddItem = (i :number)=> (()=>{
        // console.log("add", itemCreator, idx, parentFlowId);
        // if((idx || idx === 0) && parentFlowId){
        //     console.log("add !!!");
        //     const newItem = itemCreator.creator() ;
        //     const newSymId = addItem(newItem) ;
        //     addSymToFlow(parentFlowId, idx+1, newSymId);
        //     setIsDrawerOpen(false);
        // }
        if((idx || idx === 0) && parentFlowId){
            const addItemFunction = addItemFunctions[i] ;
            const newSymId = addItemFunction()[0];
            addSymToFlow(parentFlowId, idx+1, newSymId);
            setIsDrawerOpen(false);
        }
    }) ;
    const handleCloseDrawer = ()=>{
        setIsDrawerOpen(false);
    } ;   
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
            <Drawer anchor="left" open={isDrawerOpen} style={{zIndex:10001}} onClose={handleCloseDrawer}>
                {
                    itemCreators.map((ele,idx)=>(
                        <div onClick={handleAddItem(idx)} key={ele.name}>
                            {ele.name}/
                            {ele.description}
                        </div>
                    ))
                }
            </Drawer>
        </ArrowContainer>
    ) ;
}


