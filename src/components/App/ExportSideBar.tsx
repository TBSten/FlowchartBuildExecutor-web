import { Alert, ButtonGroup, CircularProgress, MenuItem, Select, SelectChangeEvent, Stack, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EnableTarget, enableTargets, useFbeToProgram } from "src/lib/fbeToProgram";
import { donwloadImage } from "src/lib/image";
import { logger } from "src/lib/logger";
import { setEmphasisTarget } from "src/redux/app/actions";
import { useChange } from "src/redux/app/hooks";
import { NONE_KEY, TO_IMG_KEY, TO_PROGRAM_KEY } from "src/redux/app/lib";
import { getEmphasisTarget } from "src/redux/app/selectors";
import { useTitle } from "src/redux/meta/hooks";
import Emphansible from "../util/Emphansible";
import ProgramConvertView from "./ProgramConvertView";
import SidebarContent from "./SidebarContent";

interface ExportSideBarProps {
}
const ExportSideBar: FC<ExportSideBarProps> = () => {
    const [title] = useTitle();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setEmphasisTarget({ key: NONE_KEY }))
    }, [dispatch]);
    const handleToImg = useCallback(() => {
        donwloadImage(title);
    }, [title])
    const tabs = useMemo(() => [
        {
            label: "画像に変換",
            node:
                <Emphansible
                    target={TO_IMG_KEY}
                    p={1}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                    }}>
                    <ButtonGroup variant="contained">
                        <Button onClick={handleToImg} >
                            画像に変換する
                        </Button>
                    </ButtonGroup>
                </Emphansible>
        },
        {
            label: "プログラムに変換",
            node:
                <Emphansible target={TO_PROGRAM_KEY} p={1}>
                    <ToProgram />
                </Emphansible>

        }
    ], [handleToImg]);
    const [nowTab, setNowTab] = useState(tabs[0].label);
    const handleChangeTab = (e: React.SyntheticEvent, newValue: string) => {
        setNowTab(newValue)
    }
    const emphasisTarget = useSelector(getEmphasisTarget());
    useEffect(() => {
        if (tabs.find(t => t.label === emphasisTarget)) {
            setNowTab(emphasisTarget);
            window.location.hash = "sidebar-" + emphasisTarget;
        }
    }, [emphasisTarget, tabs])
    return (
        <Box>
            <Box>
                フローチャートを出力する

                <Tabs
                    value={nowTab}
                    onChange={handleChangeTab}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    {tabs.map(tab => (
                        <Tab
                            key={tab.label}
                            label={tab.label}
                            value={tab.label}
                        />
                    ))}
                </Tabs>
                {tabs.map(tab => (
                    tab.label === nowTab &&
                    <SidebarContent
                        title={tab.label}
                        key={tab.label}
                        defaultExpanded
                    >
                        {tab.node}
                    </SidebarContent>
                ))}
            </Box >
        </Box >
    );
}

export default ExportSideBar;

interface ToProgramProps {
}
const ToProgram: FC<ToProgramProps> = () => {
    const [target, setTarget] = useState<EnableTarget>(enableTargets[0]);
    const { isExistsChange } = useChange();
    const [program, setProgram] = useState<null | string>(null);
    const [errMsg, setErrMsg] = useState<null | string>(null);
    const [fetchState, setFetchState] = useState<"before" | "fetching" | "success" | "error">("before");
    useEffect(() => {
        setProgram(null)
        setFetchState("before")
    }, [isExistsChange])
    useEffect(() => {
        setProgram(null)
        setFetchState("before")
    }, [target])
    const fbeToProgram = useFbeToProgram();

    const handleFBEToProgram = async () => {
        try {
            const start = new Date();
            setFetchState("fetching")
            const [program] = await Promise.all([
                fbeToProgram(target),
                new Promise<void>((resolve) => setTimeout(resolve, 750))
            ]);
            const end = new Date();
            logger.log(program);
            logger.log("took", end.valueOf() - start.valueOf());
            setProgram(program);
            setFetchState("success")
        } catch (e) {
            logger.error(e);
            setFetchState("error")
            const error = e as any;
            setErrMsg(
                error?.details ??
                error?.error ??
                "不明なエラー"
            );
        }
    };
    const handleChangeTarget = (e: SelectChangeEvent) => {
        setTarget(e.target.value as EnableTarget)
        setProgram(null)
    }
    return (
        <>
            プログラミング言語：
            <Select value={target} onChange={handleChangeTarget}>
                {enableTargets.map(target => (
                    <MenuItem key={target} value={target}>{target}</MenuItem>
                ))}
            </Select>
            <Stack sx={{ py: 2 }} spacing={1}>
                {fetchState === "before" ?
                    "" :
                    fetchState === "fetching" ?
                        <Box py={1} sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <CircularProgress />
                        </Box>
                        :
                        <Alert severity={
                            fetchState === "success" ? "success" :
                                fetchState === "error" ? "error" : undefined
                        } sx={{
                            transition: "1s"
                        }}>
                            {fetchState === "success" ? "変換に成功しました" :
                                fetchState === "error" ? <>
                                    <Box>
                                        エラーが発生しました
                                    </Box>
                                    <Box sx={{ fontSize: "0.7em" }}>
                                        詳細:{errMsg}
                                    </Box>
                                </> :
                                    ""
                            }
                        </Alert>
                }
                {typeof program === "string" ?
                    <ProgramConvertView target={target}>
                        {program}
                    </ProgramConvertView>
                    : ""}
                <Button
                    variant={program === null ? "contained" : "text"}
                    onClick={handleFBEToProgram}
                    disabled={fetchState === "fetching"}
                >
                    {program === null ? "" : "もう一度"}
                    変換する
                </Button>
            </Stack>
        </>
    );
}

