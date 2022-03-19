import Box from "@mui/material/Box";
import makeStyles from "@mui/styles/makeStyles";
// import Guide from "./components/App/Guide";
import { useEffect, useRef } from "react";
import { loadFromBrowser } from "src/format";
import BuildPane from "./components/App/BuildPane";
import ConfirmOnUnload from "./components/App/ConfirmOnUnload";
import Header from "./components/App/Header";
import KeyboardHotkeys from "./components/App/KeyboardHotkeys";
import Sidebar from "./components/App/SideBar";
import TitleAccordion from "./components/util/TitleAccordion";
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

                {/* <Box
                    sx={{
                        position: "fixed",
                        right: isSp ? 16 : 20,
                        top: `calc(${headerHeight}px + 10px)`,
                    }}
                >
                    <Fabs />
                </Box> */}

                <Box
                    sx={{
                        position: "fixed",
                        right: isSp ? 0 : 20,
                        bottom: isSp ? 0 : 10,
                        maxWidth: isSp ? "100%" : "min(calc(100% - 10em),50vw)",
                        minWidth: isSp ? "100%" : null,
                        maxHeight: isSp ? "35vh" : "calc(100vh - 10px - 132px )",
                        overflow: "auto",
                    }}
                >
                    <Box
                        sx={{
                            overflow: isSp ? "auto" : "visible",
                            p: isSp ? 0 : 0.25,
                            maxHeight: "100%"
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

