import Box from "@mui/material/Box";
import makeStyles from "@mui/styles/makeStyles";
import { useEffect, useRef } from "react";
import { loadFromBrowser } from "src/format/browser";
import BuildPane from "./components/App/BuildPane";
import ConfirmOnUnload from "./components/App/ConfirmOnUnload";
import Header from "./components/App/Header";
import KeyboardHotkeys from "./components/App/KeyboardHotkeys";
import Sidebar from "./components/App/SideBar";
import TitleAccordion from "./components/util/TitleAccordion";
import { getFromServer } from "./format/share";
import { loadJson } from "./format/util";
import { logger } from "./lib/logger";
import { useSp } from "./style/media";


const useAppStyles = makeStyles({
    root: {
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
});


function App() {
    const appClasses = useAppStyles();
    const isSp = useSp();
    const ref = useScrollPos();
    useEffect(() => {
        loadFromBrowser();
    }, []);
    useSharedSaveData();
    const headerHeight = (isSp ? 56 : 64) * 2;
    return (
        <Box className={appClasses.root}>

            <Header />

            <Box
                sx={{
                    width: "100%",
                    flexGrow: 1,
                    overflow: "scroll",
                    position: "relative",
                    height: `calc(100% - ${headerHeight}px)`,
                    backgroundColor: "#dbdbdb",
                }}
                ref={ref}
            >
                <Box
                    sx={{
                        width: "fit-content",
                        height: "fit-content",
                    }}
                >
                    <BuildPane />
                </Box>

                <Box
                    sx={{
                        position: "fixed",
                        right: isSp ? 0 : 20,
                        bottom: isSp ? 0 : 10,
                        maxWidth: isSp ? "100%" : "min(calc(100% - 10em),50vw)",
                        minWidth: isSp ? "100%" : "min(calc(100% - 10em),50vw)",
                        // minWidth: isSp ? "100%" : null,
                        maxHeight: isSp ? "35vh" : "calc(100vh - 10px - 132px )",
                        // minHeight: isSp ? null : "calc(100vh - 10px - 132px )",
                        p: isSp ? 0.5 : undefined,
                        overflow: "auto",
                    }}
                >

                    <Box
                        sx={{
                            overflow: isSp ? "auto" : "visible",
                            maxHeight: "100%",
                        }}
                    >
                        <TitleAccordion title="サイドバー" defaultExpanded>
                            <Sidebar />
                        </TitleAccordion>
                    </Box>
                </Box>
            </Box>

            <ConfirmOnUnload />
            <KeyboardHotkeys />

        </Box>
    );
}

export default App;


function useScrollPos() {
    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
        const wid = window.innerWidth;
        const hei = window.innerHeight;
        //初期スクロール位置の初期化
        if (ref.current) {
            ref.current.scrollLeft = wid * 0.6;
            ref.current.scrollTop = hei * 0.6;
        }
    }, []);
    return ref;
}

function useSharedSaveData() {
    useEffect(() => {
        (async () => {
            const params = new URLSearchParams(window.location.search);
            const SHAREID = "shareId";
            console.log(Array.from(params.keys()))
            //shareIdが指定されていたらサーバからセーブフォーマット取得
            if (params.has(SHAREID)) {
                logger.log("refer shared fbe ")
                const id = params.get(SHAREID) as string;
                logger.log("id", id)
                const fbe = await getFromServer(id);
                loadJson(fbe);
            }
        })()
    }, []);
}
