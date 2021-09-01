
// import { useGetItem, useSelectItem, useSelectItemId } from "atom/syms";
import React from "react";
import { useDispatch } from "react-redux";
import { useGetItem } from "redux/reducers/items";
import { useSelectItemId } from "redux/reducers/selectItem";
import {selectItemById} from "redux/reducers/selectItem" ;
import { useRef,  ReactNode, useEffect, useCallback,   } from "react";
import styled, { css } from "styled-components" ;


export const conf = {
    width: 180,
    height: 40,
    baseBackC: "white",
    baseForeC: "black",
    selectBackC: "white",
    selectForeC: "blue",
    exeBackC: "white",
    exeBaForeC: "green",
    lineWidth: 2,
};

const SymContainer = styled.div<{autoSize :boolean}>`
    /* width: ${conf.width}px ;
    height: ${conf.height}px ; */
    display: flex;
    flex-direction: column ;
    justify-content: center;
    align-items: center;
    position: relative;
    ${
        (props)=> props.autoSize?
            css`
                width: ${conf.width}px ;
                height: ${conf.height}px ;
            `:
            css`
                display:inline-flex;
                width:auto;
                height:auto;
            `
    }
    
`;
// const Glass = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     position: relative;
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     z-index: 2;
// `;
const Child = styled.div<{autoSize :boolean}>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    font-size: 14px;
    word-break: break-all;
    text-align: center;
    box-sizing: border-box;
    /* padding: ${conf.lineWidth}px; */
    ${
        (props)=>!props.autoSize?
            css`
                position:static;
            `:""
    }
`;
const Canvas = styled.canvas`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow-wrap:break-word;
`;


export type SymRender = 
    (
        ctx :CanvasRenderingContext2D,
        w :number, 
        h :number, 
        lw :number )=>void ;

export interface SymProps{
    children?: ReactNode;
    render: SymRender;
    autoSize? :boolean;
    id :string;
}
export default function Sym({children, render, autoSize=true, id }: SymProps){
    // console.log("Sym");
    // const selectItem = useSelectItem();
    const selectItemId = useSelectItemId();
    const getItem = useGetItem();
    const dispatch = useDispatch();

    //canvas render
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const canvasRender = useCallback(function (){
        if(canvasRef?.current){
            const canvas = canvasRef.current ;
            const ctx = canvas.getContext("2d");
            if(ctx){
                const w = canvas.width ;
                const h = canvas.height ;
                const lw = conf.lineWidth ;
                //init
                ctx.clearRect(0,0,w,h);
                ctx.fillStyle = selectItemId === id ? conf.selectBackC : conf.baseBackC ;
                ctx.strokeStyle = selectItemId === id ? conf.selectForeC : conf.baseForeC ;
                ctx.lineWidth = lw ;
                render(ctx, w, h , lw);
            }
        }
    },[canvasRef,render,selectItemId,id]);
    useEffect(() => {
        canvasRender();
    }, [canvasRender, ]);

    const handleClick = ((e :React.MouseEvent<HTMLDivElement>)=>{
        if(selectItemId !== id){
            // selectItem(id);
            dispatch(selectItemById(id));
        }else{
            // selectItem("none");
            dispatch(selectItemById("none"));
        }
        e.preventDefault();
        e.stopPropagation();
    });

    return (
        React.useMemo(()=>
            <SymContainer autoSize={autoSize}>
                <Canvas width={conf.width} height={conf.height} ref={canvasRef}/>
                <Child onClick={handleClick} autoSize={autoSize}>{children}</Child>
            </SymContainer>
            ,
            [
                id,
                getItem(id)?getItem(id)?.options:"",
                getItem(id)?getItem(id)?.syms:"",
                //handleClick, autoSize, 
                handleClick,
                autoSize,
                children,
            ]

        )

    ) ;
}

