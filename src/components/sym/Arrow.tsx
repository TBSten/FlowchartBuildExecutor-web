import styled from "styled-components" ;
import { useRef } from "react";
import { useEditItems } from "atom/syms";
import AddIcon from "@material-ui/icons/Add" ;
import IconButton from "@material-ui/core/IconButton" ;

import {conf} from "./Sym" ;
import { makeStyles } from "@material-ui/styles";
import {calcSymCreator} from "../../util/itemCreator" ;


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
    parentFlowId? :number,
    idx? :number,
    addable? :boolean,
}

export default function Arrow({idx,parentFlowId,addable=true}: ArrowProps){
    const { mode,addItem,addSymToFlow, } = useEditItems();
    const classes = useStyles();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    if(canvasRef?.current){
        const canvas = canvasRef.current ;
        const ctx = canvas.getContext("2d") ;
        if(ctx){
            console.log("arrow draw");
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
        console.log("Arrow Clicked :",parentFlowId,idx,addable);
        if(addable && (parentFlowId || parentFlowId === 0)){
            //getItem(parentFlowId).syms に idx をもとに追加
            if(idx || idx === 0){
                const newItem = calcSymCreator() ;
                const newSymId = addItem(newItem) ;
                addSymToFlow(parentFlowId, idx+1, newSymId);
            }
        }
    }
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
        </ArrowContainer>
    ) ;
}


