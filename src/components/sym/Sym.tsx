
import { useDispatch } from "react-redux";
import {selectItemById, useSelectItemIds, } from "redux/reducers/selectItem" ;
import { useRef,  ReactNode, useEffect, useCallback, useMemo, useState,  } from "react";
import styled, { css } from "styled-components" ;
import { useExecutingId, useRuntime } from "redux/reducers/exes";


export const conf = {
    width: 180,
    height: 40,
    baseBackC: "white",
    baseForeC: "black",
    selectBackC: "white",
    selectForeC: "blue",
    exeBackC: "white",
    exeForeC: "green",
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
    user-select: none;
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
    font-size: 12px;
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


//高階コンポーネントにしとけばよかった（後悔）
export default function Sym({children, render, autoSize=true, id }: SymProps){
    const selectItemIds = useSelectItemIds();
    const executingId = useExecutingId();
    const runtime = useRuntime();

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
                const isSelect = selectItemIds.includes(id) ;
                const isExe = runtime !== null&& executingId === id ;
                if(isExe){
                    ctx.fillStyle = conf.exeBackC ;
                    ctx.strokeStyle = conf.exeForeC ;
                }else if(isSelect){
                    ctx.fillStyle = conf.selectBackC ;
                    ctx.strokeStyle = conf.selectForeC ;
                }else{
                    ctx.fillStyle = conf.baseBackC ;
                    ctx.strokeStyle = conf.baseForeC ;
                }
                ctx.lineWidth = lw ;

                render(ctx, w, h , lw);
            }
        }
    },[executingId,id,render,runtime,selectItemIds.includes(id),]);
    useEffect(() => {
        // console.log("canvas render");
        canvasRender();
    }, [canvasRender, ]);
    // useEffect(() => {
    //     console.log("canvasRender");
    //     canvasRender();
    // }, []);

    const handleClick = useCallback((e :React.MouseEvent<HTMLDivElement>)=>{
        dispatch(selectItemById(id));
        e.preventDefault();
        e.stopPropagation();
    },[id,dispatch,]);

    return (
        useMemo(()=>
            <SymContainer autoSize={autoSize} >
                <Canvas width={conf.width} height={conf.height} ref={canvasRef}/>
                <Child onMouseDown={handleClick} autoSize={autoSize}>{children}</Child>
            </SymContainer>
            ,
            [
                handleClick,
                autoSize,
                children,
                canvasRef,
            ]
        )
    ) ;
}

