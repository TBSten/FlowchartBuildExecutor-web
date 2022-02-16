import {
    Button,
    IconButton,
    ButtonGroup,
    Tabs,
    Tab,
    Slider,
    // List,
    // ListItem,
    // ListItemText,
    // Dialog,
    // DialogTitle,
    // DialogContent,
    // DialogActions,
    Chip,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import MuiPaper from "@material-ui/core/Paper";

import styled from "styled-components";
import { sp } from "../../css/media";
import { setOption, setItem } from "redux/items/actions";
import { useGetItem } from "redux/items/hooks";
import { toggleMulti, } from "redux/app/actions";
import { useSelectItemId, useMultiSelect } from "redux/app/hooks";
import React, { ReactNode, useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setZoom, incZoom } from "redux/app/actions";
import {
    Done,
    DoneAll,
    Add,
    Search,
    ZoomIn,
    ZoomOut,
    PlayArrow,
    Stop,
} from "@material-ui/icons";
// import { flowCreator, terminalSymCreator } from "util/itemCreator";
import { flowCreator } from "item/creator/flow";
import { terminalSymCreator } from "item/creator/terminal";
import { randomStr } from "util/functions";
import { addTopFlow } from "redux/top/actions";
import { useMode } from "redux/app/hooks";
import { useRuntime } from "redux/app/hooks";
import { setRuntime } from "redux/app/actions";
import { Option } from "redux/types/item";
import TracerPane from "./TracerPane";
import Runtime from "exe/runtimes/Runtime";
import { SideBarMenu, TabData } from "./types";
import MenuDialog from "components/App/MenuDialog" ;
import { nullable } from "util/nullable";


const SideContainer = styled(MuiPaper)`
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    width: 100%;
    height: 100%;
    overflow: auto;
    /* border: solid 1px gray;
  border-radius: 10px ; */
    box-sizing: border-box;
    z-index: 1;

    ${sp`
    grid-column: 1 / 3;
    grid-row: 3 / 4;

    // height: 50vh;
    font-size: 1rem;
    overflow: auto;
  `}
`;
const SideBarContainer = styled.div`
    max-width: 40vw;
    overflow: auto;
    padding: 1.5rem;
    h6 {
        margin: 0.3rem 0;
    }
    ${sp`
        max-width:100%;
        padding:0.3rem;
        padding-bottom: 60px;
        // max-height: 35vh;
        box-sizing: border-box;
    `}
`;
// const Menus = styled.div`
//     width: 100%;
//     display: flex;
//     flex-direction: row;
//     justify-content: flex-start;
//     flex-wrap: wrap;
//     & > * {
//         margin-right: 10px;
//         margin-bottom: 20px;
//     }
// `;
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
// const ToggleSideShow = styled.div`
//     position: absolute;
//     right: 0;
//     top: 0;
// `;
const RightAlign = styled.div`
    text-align: right;
    width: 100%;

    ${sp`
        display:none;
    `}
`;
const SliderCon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

interface OptionLineProps {
    ele: Option<string>;
    updateOption: (name: string, value: string | number | boolean) => void;
    Input: React.FC<{
        name: string;
        value: string | number | boolean;
        args: string | number | boolean | object | string[] | number[];
        updateOption: (name: string, value: string | number | boolean) => void;
    }>;
}

function OptionLine({ele,updateOption,Input,}: OptionLineProps) {
    // console.log("OptionLine render");
    return (
        <tr>
            <td>{ele.name}</td>
            <td>
                <Input
                    name={ele.name}
                    value={ele.value}
                    args={ele.args}
                    updateOption={updateOption}
                />
            </td>
        </tr>
    );
}
interface SideBarProps {
    show: boolean;
    showSideBar: () => void;
    hideSideBar: () => void;
}

interface ControllPaneProps {
    runtime?: Runtime|null;
}
function ControllPane({ runtime }: ControllPaneProps) {
    const dispatch = useDispatch();
    const [speed, setSpeed] = useState(5);
    const handleChangeSpeed = (
        e: React.ChangeEvent<{}>,
        newValue: number | number[]
    ) => {
        setSpeed(newValue as number);
    };
    const handleChangeCommitted = (
        e: React.ChangeEvent<{}>,
        newValue: number | number[]
    ) => {
        if(runtime){
            runtime.setSpeed(speed);
            dispatch(setRuntime(runtime));
        }
    };
    useEffect(() => {
        if(runtime){
            setSpeed(runtime.getSpeed());
        }
    }, []);

    async function execute() {
        if(runtime){
            await runtime.next();
            dispatch(setRuntime(runtime));
        }
    }
    async function executeAll() {
        // console.log("runtime !!",runtime);
        setTimeout(async () => {
            if(runtime){
                await runtime.exeAll();
                dispatch(setRuntime(runtime));
            }
        }, 100);
    }
    async function stop() {
        if(runtime){
            runtime.stop();
            dispatch(setRuntime(runtime));
        }
    }
    const marks = [
        { value: 1, label: "遅い" },
        { value: 10, label: "速い" },
    ];
    return (
        <>
            <h6>「{runtime?.name}」で実行</h6>
            <div>{runtime?.description}</div>
            <h6>制御</h6>
            <ButtonGroup>
                <Button
                    onClick={() => {
                        execute();
                    }}
                    startIcon={<PlayArrow />}
                    variant="outlined"
                    color="primary"
                    disabled={runtime?.status === "done"}
                >
                    実行
                </Button>
                <Button
                    onClick={() => {
                        executeAll();
                    }}
                    startIcon={<PlayArrow />}
                    variant="outlined"
                    color="primary"
                    disabled={runtime?.status === "done"}
                >
                    すべて実行
                </Button>
                <Button
                    onClick={() => {
                        stop();
                    }}
                    startIcon={<Stop />}
                    variant="outlined"
                    color="primary"
                    disabled={runtime?.status === "done"}
                >
                    終了
                </Button>
            </ButtonGroup>
            <h6>スピード</h6>
            <SliderCon>
                <Slider
                    marks={marks}
                    valueLabelDisplay="on"
                    step={1}
                    min={1}
                    max={10}
                    value={speed}
                    onChange={handleChangeSpeed}
                    onChangeCommitted={handleChangeCommitted}
                />
            </SliderCon>
            <h6>ステータス</h6>
            <div>
                <Chip
                    label={
                        runtime?.status==="waiting"?
                        "まだ実行していません":
                        runtime?.status==="doing"?
                        "実行中":
                        runtime?.status==="done"?
                        "実行終了":
                        "! エラー"
                    }
                    color="secondary" />
            </div>
        </>
    );
}

export default function SideBar(props: SideBarProps) {
    const mode = useMode();
    const selectItemId = useSelectItemId();
    const multiSelect = useMultiSelect();
    const dispatch = useDispatch();
    const runtime = useRuntime();

    const getItem = useGetItem();

    const [tabIdx, setTabIdx] = useState(0);
    const [menuDialogOpen,setMenuDialogOpen] = useState(false) ;

    // const [show, setShow] = useState(false);
    const show = props.show;

    let child: string | ReactNode = <div>none selected</div>;

    const item = useMemo(()=>{
        console.log("changed selectItemId")
        return getItem(selectItemId);
    },[selectItemId]);
    if (mode === "edit") {
        const menus: (SideBarMenu|"hr")[] = [];
        const handleToggleMultiSelect = () => {
            dispatch(toggleMulti(!multiSelect));
        };
        const handleAddFlow = () => {
            const sid = randomStr(30);
            const eid = randomStr(30);
            const s = terminalSymCreator("はじめ");
            const e = terminalSymCreator("おわり");
            dispatch(setItem(sid, s));
            dispatch(setItem(eid, e));
            const fid = randomStr(30);
            const f = flowCreator([sid, eid]);
            dispatch(setItem(fid, f));
            dispatch(addTopFlow(fid));
        };
        if (selectItemId !== "none" && item) {
            child = item.options.map((ele, idx) => {
                const Input = ele.type.input() ;
                const updateOption = (
                    name: string,
                    value: string | number | boolean
                ) => {
                    console.log("dispatch setOption :", name, value);
                    dispatch(setOption(selectItemId, name, value));
                };

                // console.log(ele);
                if (ele.isVisible(item) === true) {
                    return (
                        <OptionLine
                            key={idx}
                            ele={ele}
                            updateOption={updateOption}
                            Input={Input}
                        />
                    );
                } else {
                    return <tr key={idx}></tr>;
                }
            });
            child = (
                <>
                    <h6>オプション</h6>
                    <table>
                        <tbody>{child}</tbody>
                    </table>
                </>
            );
            menus.push(...item.menus);
            menus.push("hr");
        }
        if(multiSelect){
            menus.push(
                {
                    label: "複数選択モード:ON",
                    onClick: handleToggleMultiSelect, 
                    icon: <Done />,
                },
            );
        }else{
            menus.push(
                {
                    label: "複数選択モード:OFF",
                    onClick: handleToggleMultiSelect, 
                    icon: <DoneAll />,
                },
            );
        }
        menus.push(
            {
                label: "フローを追加",
                onClick: handleAddFlow, 
                icon: <Add />,
            },
        );
        child = (
            <>
                {child}
                <hr />
                <h6>メニュー</h6>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={()=>setMenuDialogOpen(true)}
                    disabled={menus.length <= 0}>
                    メニューを開く
                </Button>

                <h6>ステータス</h6>
                <div>
                    {multiSelect?
                    <Chip 
                        label="複数選択" 
                        // variant="outlined" 
                        color="secondary" 
                        onDelete={handleToggleMultiSelect}/>:""}
                </div>

                <MenuDialog 
                    open={menuDialogOpen} 
                    onClose={()=>setMenuDialogOpen(false)}
                    menus={menus}
                    itemId={selectItemId}/>
                {/* 
                <Dialog open={menuDialogOpen} onClose={()=>setMenuDialogOpen(false)}>
                    <DialogTitle>メニュー</DialogTitle>
                    <DialogContent>
                        <List>
                            {menus.length <= 0?
                            "エラー"
                            :
                            menus.map((menu) => (
                                menu === "hr" ?
                                <hr/>
                                :
                                <ListItem button onClick={()=>{setMenuDialogOpen(false);menu.onClick();}}>
                                    {menu.icon}
                                    {menu.label}
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="outlined" 
                            color="primary" 
                            onClick={()=>setMenuDialogOpen(false)}>
                                閉じる
                        </Button>
                    </DialogActions>
                </Dialog>

                */}
            </>
        );
    } else if (mode === "exe") {
        const tabs: TabData[] = [
            {
                label: "実行",
                comp: <ControllPane runtime={runtime} />,
            },
            {
                label: "変数一覧",
                comp: <TracerPane />,
            },
        ];
        if (runtime) {
            tabs.push(...runtime.getTabs());
        }
        child = (
            <>
                {runtime ? (
                    <>
                        <Tabs
                            value={tabIdx}
                            variant="scrollable"
                            scrollButtons="auto"
                            indicatorColor="primary"
                        >
                            {/* <Tab label="実行" onClick={()=>{setTabIdx(0)}}/>
                        <Tab label="変数一覧" onClick={()=>{setTabIdx(1)}}/> */}
                            {tabs.map((tab, idx) => (
                                <Tab
                                    label={tab.label}
                                    onClick={() => {
                                        setTabIdx(idx);
                                    }}
                                    key={idx}
                                />
                            ))}
                        </Tabs>

                        {tabs.map((tab, idx) =>
                            tabIdx === idx ? tab.comp : ""
                        )}
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
                        <hr />

                        {/* <ExeView /> */}
                    </>
                ) : (
                    <>ランタイムを選んでください</>
                )}
            </>
        );
    }
    return useMemo(()=>
        <>
            {show ? (
                <>
                    <SideContainer>
                        <RightAlign>
                            <IconButton onClick={() => props.hideSideBar()}>
                                {/* <ArrowForward/> */}
                                <Cancel />
                            </IconButton>
                        </RightAlign>
                        <SideBarContainer>
                            {/* サイドバー */}
                            {child}
                            <ZoomBar key={"zoom"}>
                                <IconButton
                                    onClick={() => {
                                        dispatch(incZoom(+0.1));
                                    }}
                                    color="primary"
                                    key={"zoomup"}
                                >
                                    <ZoomIn />
                                </IconButton>
                                <Button
                                    startIcon={<Search />}
                                    onClick={() => {
                                        dispatch(setZoom(1.0));
                                    }}
                                    color="primary"
                                    key={"zoomreset"}
                                >
                                    リセット
                                </Button>
                                <IconButton
                                    onClick={() => {
                                        dispatch(incZoom(-0.1));
                                    }}
                                    color="primary"
                                    key={"zoomdown"}
                                >
                                    <ZoomOut />
                                </IconButton>
                            </ZoomBar>
                        </SideBarContainer>
                    </SideContainer>
                </>
            ) : (
                <ToggleSideShowCon>
                    {/* 隠す */}
                    {/* <ToggleSideShow>
                    <IconButton onClick={()=>props.showSideBar()}>
                        <ArrowBack/>
                    </IconButton>
                </ToggleSideShow> */}
                </ToggleSideShowCon>
            )}
        </>
    ,[
        child, dispatch, props, show,
        // selectItemId,
        // mode,
        // multiSelect,
        // runtime,
        // tabIdx,
        // menuDialogOpen,
        // show,

    ]);
}
