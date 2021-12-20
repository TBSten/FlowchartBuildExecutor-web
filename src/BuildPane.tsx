import { useDispatch } from "react-redux";
import { useTopFlows } from "redux/top/hooks";
import { useGetItem } from "redux/items/hooks";
// import { useGetItem, useTopFlows } from "atom/syms";
import styled from "styled-components";
import { sp } from "./css/media";
import { useZoom } from "redux/app/hooks";
import { useSelectItemIds } from "redux/app/hooks";
import { selectItemById } from "redux/app/actions";
import SelectAllIcon from "@material-ui/icons/SelectAll";
import { assignLoopCnt } from "components/sym/WhileSym";
import AppDialog from "components/App/AppDialog";
import { useRef } from "react";


const FlowContainer = styled.div`
    display: inline-grid;
    grid-auto-flow: column;
    grid-template-rows: 1fr;
    gap: 1rem;

    padding: 180px;
    width: auto;
    transform-origin: left top;

    ${sp`
        transform: scale(0.7);
        transform-origin: left top ;
    `}
`;

export default function BuildPane() {
    // console.log("BuildPane");
    const topFlows = useTopFlows();
    const getItem = useGetItem();
    const zoom = useZoom();
    const dispatch = useDispatch();
    const selectItemIds = useSelectItemIds();
    const ref = useRef<null|HTMLDivElement>(null) ;
    assignLoopCnt();

    // const multiSelect = useMultiSelect() ;

    // useEffect(() => {
    //     console.log(ref.current);
    //     const keyFlgs = {
    //         multiSelect,
    //         save: false,
    //     };
    //     const keydownHandler = (e: KeyboardEvent) => {
    //         //シフトキー
    //         if (!keyFlgs.multiSelect && e.shiftKey) {
    //             console.log("multi start");
    //             dispatch(toggleMulti(true));
    //             keyFlgs.multiSelect = true;
    //             return false;
    //         }
    //     };
    //     const keyupHandler = (e: KeyboardEvent) => {
    //         //シフトキー
    //         if (keyFlgs.multiSelect && !e.shiftKey) {
    //             console.log("multi end");
    //             dispatch(toggleMulti(false));
    //             keyFlgs.multiSelect = false;
    //         }
    //     };
    //     const keypressHandler = (e: KeyboardEvent) => {
    //         //保存
    //         if (e.key === "s") {
    //             saveBrowserSaveData();
    //             return false;
    //         }
    //         return true;
    //     };
    //     if(ref.current){
    //         ref.current.addEventListener("keydown", keydownHandler);
    //         ref.current.addEventListener("keyup", keyupHandler);
    //         ref.current.addEventListener("keypress", keypressHandler);
    //     }

    //     return () => {
    //         if(ref.current){
    //             ref.current.removeEventListener("keydown", keydownHandler);
    //             ref.current.removeEventListener("keyup", keyupHandler);
    //             ref.current.removeEventListener("keypress", keypressHandler);
    //         }
    //     };
    // }, [dispatch, multiSelect, ref]);

    const memodChild = (
        <FlowContainer
            style={{ transform: `scale(${zoom})` }}
            id="fbe-buildpane"
            ref={ref}
        >
            {topFlows.map((ele, idx) => {
                const item = getItem(ele);
                if (item) {
                    const Ele = item.component;
                    const handleClick = () => {
                        dispatch(selectItemById(ele));
                    };
                    const isSelect =
                        selectItemIds && selectItemIds.includes(ele);
                    return (
                        <div key={idx}>
                            <div
                                style={{ display: "flex" }}
                                onClick={handleClick}
                            >
                                <SelectAllIcon
                                    color={isSelect ? "primary" : undefined}
                                />
                            </div>
                            <div
                                style={
                                    isSelect
                                        ? {
                                              border: "solid 1px blue",
                                              borderRadius: "10px",
                                          }
                                        : { border: "solid 1px rgba(0,0,0,0)" }
                                }
                            >
                                <Ele id={ele} item={item} key={idx} />
                            </div>
                        </div>
                    );
                } else {
                    console.log("warning flow :", item);
                    return <div key={idx}># error ! </div>;
                }
            })}

            <AppDialog />
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
    );
}
