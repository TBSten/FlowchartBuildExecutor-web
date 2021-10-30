import styled from "styled-components" ;
import { useRef, useState, useEffect, } from "react";
import AddIcon from "@material-ui/icons/Add" ;
import IconButton from "@material-ui/core/IconButton" ;
import Drawer from "@material-ui/core/Drawer" ;

import {conf} from "./Sym" ;
import { makeStyles } from "@material-ui/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { itemCreators } from "item/creator";
import { useDispatch } from "react-redux";
import { setItem, } from "redux/reducers/items";
import { useGetItem } from "redux/reducers/items";
import { Item } from "redux/types/item";
import { randomStr } from "util/functions";
import { Card, CardContent, CardActionArea, Typography, Grid, Button } from "@material-ui/core";
import { breakpoint } from "css/media";
import { useMode } from "redux/reducers/mode";
import { selectItemById } from "redux/reducers/selectItem";



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
    dMenu: {
        width:"100%",
    } ,
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
    const matches = useMediaQuery(`(max-width:${breakpoint})`);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const render = ()=>{
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
    }
    useEffect(render,);
    const dispatch = useDispatch();
    const getItem = useGetItem();
    const handleClick = ()=>{
        if(addable && parentFlowId){
            setIsDrawerOpen(true);
        }
    }
    const creators = itemCreators.map(ele=>(
        ele.creator()
    ));
    const handleAddItem = (i :number)=> (()=>{
        if(addable && parentFlowId && (idx||idx===0)){
            const sym :Item = creators[i]();
            const symId = "Item-"+randomStr(32) ;
            dispatch(setItem(symId,sym));
            const parentFlow = getItem(parentFlowId);
            const newParentFlow :Item = Object.assign({},parentFlow);
            newParentFlow.syms?.splice(idx+1,0,symId);
            dispatch(setItem(parentFlowId, newParentFlow));
            setIsDrawerOpen(false);
            dispatch(selectItemById(symId));
        }
    }) ;
    const handleCloseDrawer = ()=>{
        setIsDrawerOpen(false);
    } ;
    const mode = useMode() ;

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
            <Drawer anchor="bottom" open={isDrawerOpen} style={{zIndex:10001,}} onClose={handleCloseDrawer} >
                <Grid container spacing={2}>
                    {
                        itemCreators.map((ele,idx)=>(
                            <Grid item xs={matches?12:6} key={idx}>
                                <Card className={classes.dMenu}>
                                    <CardActionArea onClick={handleAddItem(idx)}>
                                        <CardContent key={idx}>
                                            <Typography variant="h5">{ele.name}</Typography>
                                            <Typography>
                                                {ele.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))
                    }
                    <Grid item xs={12}>
                        <Button　color="primary" variant="outlined" onClick={handleCloseDrawer}>
                            キャンセル
                        </Button>
                    </Grid>
                </Grid>
            </Drawer>
        </ArrowContainer>
    ) ;
}



