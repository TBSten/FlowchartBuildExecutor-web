import { Alert, ButtonGroup, CircularProgress, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FC, useEffect, useState } from "react";
import { EnableTarget, enableTargets, useFbeToProgram } from "src/lib/fbeToProgram";
import { donwloadImage } from "src/lib/image";
import { logger } from "src/lib/logger";
import { useChange } from "src/redux/app/hooks";
import { TO_IMG_KEY, TO_PROGRAM_KEY } from "src/redux/app/lib";
import { useTitle } from "src/redux/meta/hooks";
import Emphansible from "../util/Emphansible";
import ProgramConvertView from "./ProgramConvertView";
import SidebarContent from "./SidebarContent";

interface ExportSideBarProps {
}
const ExportSideBar: FC<ExportSideBarProps> = () => {
    const [title] = useTitle();
    const handleToImg = () => {
        donwloadImage(title);
    }
    return (
        <Box>
            <Box>

            </Box>
            <Box>
                出力モード

                <SidebarContent title="画像に変換">
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
                </SidebarContent>

                <SidebarContent title="PDFに変換">
                    <Box p={1}>
                        準備中...
                    </Box>
                </SidebarContent>

                <SidebarContent title="プログラムに変換">
                    <Emphansible target={TO_PROGRAM_KEY} p={1}>
                        <ToProgram />
                    </Emphansible>
                </SidebarContent>
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
                <Button
                    variant={program === null ? "contained" : "text"}
                    onClick={handleFBEToProgram}
                    disabled={fetchState === "fetching"}
                >
                    {program === null ? "" : "もう一度"}
                    変換する
                </Button>
                {typeof program === "string" ?
                    <ProgramConvertView target={target}>{program}</ProgramConvertView>
                    : ""}
            </Stack>
        </>
    );
}

