import {
    Button, IconButton, ButtonGroup, Tabs, Tab, 
    Slider, 
} from "@material-ui/core" ;
import {
    Cancel,
} from "@material-ui/icons" ;

import styled from "styled-components" ;
import {sp} from "../../css/media" ;
import { useGetItem, setOption, setItem,  } from "redux/reducers/items" ;
import MuiPaper from "@material-ui/core/Paper" ;
import {toggleMulti, useSelectItemId, useMultiSelect, } from "redux/reducers/selectItem" ;
import React,{ ReactNode, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setZoom, incZoom } from "redux/reducers/edits";
import { Done,DoneAll,Add,Search,ZoomIn,ZoomOut,PlayArrow,Stop } from "@material-ui/icons";
import { flowCreator, terminalSymCreator } from "util/itemCreator";
import { randomStr } from "util/functions";
import { addTopFlow } from "redux/reducers/top";
import { useMode } from "redux/reducers/mode" ; 
import { useRuntime,setRuntime,  } from "redux/reducers/exes" ;
import { Option } from "redux/types/item" ;
import TracerPane from "./TracerPane" ;
import Runtime from "exe/runtimes/Runtime";
import { TabData } from "./types" ;

const SideContainer = styled(MuiPaper)`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  width: 100%;
  height: 100%;
  overflow:auto;
  /* border: solid 1px gray;
  border-radius: 10px ; */
  box-sizing:border-box;
  z-index: 1;

  ${sp`
    grid-column: 1 / 3;
    grid-row: 3 / 4;

    height: 50vh;
    font-size: 1rem;
    overflow: auto;
  `}
`;
const SideBarContainer = styled.div`
    max-width: 40vw;
    overflow: auto;
    padding: 1.5rem;
    h6{
        margin: 0.3rem 0;
    }
    ${sp`
        max-width:100%;
        padding:0.3rem;
        padding-bottom: 60px;
        max-height: 35vh;
        box-sizing: border-box;
    `}
`;
const Menus = styled.div`
    width:100%;
    display:flex;
    flex-direction: row;
    justify-content:flex-start;
    flex-wrap:wrap;
    &>*{
        margin-right: 10px;
        margin-bottom: 20px;
    }
`;
const ZoomBar = styled.div`
    display: none;
    ${sp`
        display: block;
    `}
`;

const ToggleSideShowCon = styled.div`
    position: relative;
    ${sp`
        display: none;
    `}
`;
const ToggleSideShow = styled.div`
    position: absolute;
    right: 0;
    top: 0;
`;
const RightAlign = styled.div`
    text-align: right;
    width: 100%;

    ${sp`
        display:none;
    `}
`;
const SliderCon = styled.div`
    display :flex;
    justify-content: center;
    align-items: center;
`;

function OptionLine(
    {
        ele,
        updateOption,
        Input
    }:{
        ele:Option<string>,
        updateOption:(name: string, value: string | number | boolean) => void,
        Input:React.FC<{
            name: string;
            value: string | number | boolean;
            args: string | number | boolean | object | string[] | number[];
            updateOption: (name: string, value: string | number | boolean) => void;
        }>
    }){
    return (
        <tr>
            <td>
                {ele.name}
            </td>
            <td>
                <Input 
                    name={ele.name} 
                    value={ele.value} 
                    args={ele.args}
                    updateOption={updateOption}/>
            </td>
        </tr>
    ) ;
}
interface SideBarProps{
    show:boolean;
    showSideBar:()=>void;
    hideSideBar:()=>void;
}

interface ControllPaneProps{
    runtime:Runtime;
}
function ControllPane({runtime} :ControllPaneProps){
    const dispatch = useDispatch() ;
    const [speed, setSpeed] = useState(5) ;
    const handleChangeSpeed = (e: React.ChangeEvent<{}>, newValue: number | number[]) => {
        setSpeed(newValue as number);
    };
    const handleChangeCommitted = (e: React.ChangeEvent<{}>, newValue: number | number[])=>{
        runtime.setSpeed(speed);
        dispatch(setRuntime(runtime));
    };
    useEffect(()=>{
        setSpeed(runtime.getSpeed());
        // runtime.setSpeed(speed);
        // dispatch(setRuntime(runtime));
    },[]);

    async function execute(){
        // console.log("runtime !!",runtime);
        await runtime.next();
        dispatch(setRuntime(runtime));
    }
    async function executeAll(){
        // console.log("runtime !!",runtime);
        setTimeout(async ()=>{
            await runtime.exeAll();
            dispatch(setRuntime(runtime));
        },100);
    }
    async function stop(){
        runtime.stop();
        dispatch(setRuntime(runtime));
    }
    const marks = [
        {value:1, label:"遅い",},
        {value:10, label:"速い",},
    ] ;
    return (
        <>
            <h6>「{runtime.name}」で実行</h6>
            <div>{runtime.description}</div>
            <h6>制御</h6>
            <ButtonGroup>
                <Button 
                    onClick={()=>{execute()}} 
                    startIcon={<PlayArrow/>} 
                    variant="outlined" 
                    color="primary"
                    disabled={runtime.status === "done"}>
                    実行
                </Button>
                <Button 
                    onClick={()=>{executeAll()}} 
                    startIcon={<PlayArrow/>} 
                    variant="outlined" 
                    color="primary"
                    disabled={runtime.status === "done"}>
                    すべて実行
                </Button>
                <Button 
                    onClick={()=>{stop()}}
                    startIcon={<Stop/>} 
                    variant="outlined" 
                    color="primary"
                    disabled={runtime.status === "done"}>
                    終了
                </Button>
            </ButtonGroup>
            <h6>スピード</h6>
            <SliderCon>
                <Slider 
                    marks={marks} valueLabelDisplay="on"
                    step={1} min={1} max={10}
                    value={speed}
                    onChange={handleChangeSpeed} 
                    onChangeCommitted={handleChangeCommitted}
                    />
            </SliderCon>
        </>
    ) ;
}

export default function SideBar(props:SideBarProps){

    const mode = useMode();
    const selectItemId = useSelectItemId();
    const multiSelect = useMultiSelect() ;
    const dispatch = useDispatch();
    const runtime = useRuntime();

    const getItem = useGetItem();

    const [tabIdx, setTabIdx] = useState(0);

    // const [show, setShow] = useState(false);
    const show = props.show ;

    let child :string | ReactNode = <div>none selected</div> ;

    if(mode === "edit"){
        const menus = [];
        const handleToggleMultiSelect = ()=>{
            dispatch(toggleMulti(!multiSelect));
        };
        const item = getItem(selectItemId);
        const handleAddFlow = ()=>{
            const sid = randomStr(30);
            const eid = randomStr(30);
            const s = terminalSymCreator("はじめ");
            const e = terminalSymCreator("おわり");
            dispatch(setItem(sid,s));
            dispatch(setItem(eid,e));
            const fid = randomStr(30);
            const f = flowCreator([sid,eid]);
            dispatch(setItem(fid,f));
            dispatch(addTopFlow(fid));
        } ;
        if(selectItemId !== "none" && item){
            child = item.options.map((ele,idx)=>{
                const Input = ele.type.input() ;
                // const Input = ele.type.input ? 
                //     ele.type.input()
                //     :
                //     ()=><># Error: valid option type, name:{ele.name} value:{ele.value} type:{ele.type}</> ;
                const updateOption = (name :string,value :string | number | boolean) => {
                    console.log("dispatch setOption :",name,value);
                    dispatch(setOption(selectItemId, name, value));
                };
                
                return (
                    <OptionLine 
                        key={idx} 
                        ele={ele} 
                        updateOption={updateOption} 
                        Input={Input} />
                ) ;
            }) ;
            child = (
                <>
                    <h6>オプション</h6>
                    <table><tbody>
                        {child}
                    </tbody></table>
                    {
                        item.menus.map(el=>(
                            <React.Fragment key={el.name}>
                                <h6>{el.name}</h6>
                                {
                                    el.component.map((Ele,idx)=>(
                                        <Ele key={idx}/>
                                    ))
                                }
                            </React.Fragment>
                        ))
                    }


                </>
            );
        }
        menus.push([
            <Button startIcon={multiSelect?<Done/>:<DoneAll/>} onClick={handleToggleMultiSelect} color="primary" variant="outlined" key={"multiSelect"}>
                {!multiSelect?
                "複数選択モード"
                :
                "複数選択モード解除"
                }
            </Button>,
        ]);
        menus.push([
            <Button onClick={handleAddFlow} startIcon={<Add/>} variant="outlined" color="primary" key={"newFlow"}>
                フローを追加
            </Button>,
        ]);
        child = (
            <>
                {child}
                <hr/>
                <h6>メニュー</h6>
                <Menus>
                {
                    menus.map((el,idx)=>(
                        <div key={idx}>
                            {el}
                        </div>
                    ))
                }
                </Menus>
            </>
        ) ;
    }else if(mode === "exe"){
        const tabs :TabData[] = [
            {
                label:"実行",
                comp:<ControllPane runtime={runtime}/>,
            },
            {
                label:"変数一覧",
                comp:<TracerPane />,
            },
        ] ;
        if(runtime){
            tabs.push(...runtime.getTabs()) ;
        }
        child = (
            <>{
                runtime ? 
                <>
                    <Tabs value={tabIdx} variant="scrollable" scrollButtons="auto" indicatorColor="primary">
                        {/* <Tab label="実行" onClick={()=>{setTabIdx(0)}}/>
                        <Tab label="変数一覧" onClick={()=>{setTabIdx(1)}}/> */}
                        {
                            tabs.map((tab,idx)=>(
                                <Tab 
                                    label={tab.label} 
                                    onClick={()=>{setTabIdx(idx)}}
                                    key={idx}/>
                            ))
                        }
                    </Tabs>

                    {
                        tabs.map((tab,idx)=>(
                            tabIdx===idx?
                                tab.comp
                            :
                                ""
                        ))
                    }
                    {/* {
                        tabIdx === 0 ? 
                        <ControllPane runtime={runtime}/>
                        :
                        tabIdx === 1 ?
                        <TracerPane />
                        :
                        <>
                            # ERROR tabIdx : {tabIdx}
                        </>
                    } */}
                    <hr/>

                </>
                    : 
                <>ランタイムを選んでください</> 
            }</>
        ) ;
    }
    return (
        <>
        {
            show?
            <>
                <SideContainer>
                    <RightAlign>
                        <IconButton onClick={()=>props.hideSideBar()}>
                            {/* <ArrowForward/> */}
                            <Cancel />
                        </IconButton>
                    </RightAlign>
                    <SideBarContainer>
                        {/* サイドバー */}
                        {
                            child
                        }
                        <ZoomBar key={"zoom"}>
                            <IconButton onClick={()=>{dispatch(incZoom(+0.1));}} color="primary" key={"zoomup"}>
                                <ZoomIn />
                            </IconButton>
                            <Button startIcon={<Search />} onClick={()=>{dispatch(setZoom(1.0));}} color="primary" key={"zoomreset"}>
                                リセット
                            </Button>
                            <IconButton onClick={()=>{dispatch(incZoom(-0.1));}} color="primary" key={"zoomdown"}>
                                <ZoomOut />
                            </IconButton>
                        </ZoomBar>
                    </SideBarContainer>
                </SideContainer>
            </>
            :
            <ToggleSideShowCon>
                {/* 隠す */}
                {/* <ToggleSideShow>
                    <IconButton onClick={()=>props.showSideBar()}>
                        <ArrowBack/>
                    </IconButton>
                </ToggleSideShow> */}
            </ToggleSideShowCon>
        }
        </>
    ) ;
}





