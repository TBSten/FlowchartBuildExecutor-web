import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import HomeIcon from "@mui/icons-material/Home";
import ImageIcon from "@mui/icons-material/Image";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import StopIcon from "@mui/icons-material/Stop";
import ZoomIn from "@mui/icons-material/ZoomIn";
import ZoomOut from "@mui/icons-material/ZoomOut";
import { Alert, CircularProgress, Grow, Menu, MenuItem, Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { ChangeEventHandler, FC, MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
    loadJson, resetBrowserSave, saveToBrowser, storeStateToJson
} from "src/format";
import { FBE_DOC_URL, FBE_SUPPORT_BACKEND_URL, VERSION } from "src/lib/constants";
import { EnableTarget, enableTargets, useFbeToProgram } from "src/lib/fbeToProgram";
import { downloadTextFile, getFileText } from "src/lib/file";
import { donwloadImage } from "src/lib/image";
import { Log, logger } from "src/lib/logger";
import { useChange, useExecute, useLogs, useMode, useSelectItemIds, useZoom } from "src/redux/app/hooks";
import { zoomUnit } from "src/redux/app/reducers";
import { resetItems } from "src/redux/items/actions";
import { useItemOperations } from "src/redux/items/hooks";
import { resetMeta } from "src/redux/meta/actions";
import { useFlows, useTitle } from "src/redux/meta/hooks";
import { usePc } from "src/style/media";
import ConfirmDialog, { useConfirmDialog } from "../util/ConfirmDialog";
import OnlyEditMode from "../util/OnlyEditMode";
import OnlyExeMode from "../util/OnlyExeMode";
import ProgramConvertView from "./ProgramConvertView";
import UtilDialog, { useUtilDialog, UtilDialogProps } from "./UtilDialog";


export interface HeaderProps { }

const Header: FC<HeaderProps> = () => {
    const { isExistsChange } = useChange();
    return (
        <AppBar
            color="transparent"
            position="static"
            sx={{ zIndex: 1 }}
            elevation={0}
        >
            <Toolbar>
                <LeftTopMenu />
                <Title />
                <Expand />
                <RightTopMenu />
            </Toolbar>
            <Toolbar sx={{
                width: "100%",
                overflow: "auto",
            }}>
                <Tools />
            </Toolbar>
        </AppBar >
    );
};
export default React.memo(Header);

const Title: FC<HeaderProps> = () => {
    const [title, setTitle] = useTitle();
    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setTitle(e.target.value)
    };
    return (
        <InputBase
            value={title}
            onChange={handleChange}
            sx={{ color: "inherit", flexGrow: 1 }}
        />
    );
};

async function sendLogs(logs: Log[]) {
    try {
        logger.log("send error", logs)
        const res = await fetch(FBE_SUPPORT_BACKEND_URL, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({ logs, })
        });
        const json = await res.json();
        logger.log(res, json)
        return typeof json?.reportNo === "number" ? json.reportNo : -1;
    } catch (e) {
        logger.error(e)
    }
}
interface RightTopMenuProps {
}
// function useMenuItems(): ({ label: string, onSelect?: () => any } | "hr")[] {
//     return useMemo(() => [
//         { label: "全てのメニュー", },
//         "hr",
//         {
//             label: "エラーレポートを送信",
//             onSelect: handleSendError,
//         }
//     ], [handleSendError]);
// }
const RightTopMenu: FC<RightTopMenuProps> = () => {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const open = Boolean(anchor);
    const handleOpen: MouseEventHandler<HTMLElement> = (e) => setAnchor(e.currentTarget);
    const handleClose = () => setAnchor(null);
    const handleSelectMenuItem = (cb: () => any) => {
        return () => {
            handleClose();
            cb();
        }
    }
    // const menuItems = useMenuItems();
    const { logs } = useLogs();
    const [reportNo, setReportNo] = useState(-1);
    const isPc = usePc();
    const [confirm, confirmProps] = useConfirmDialog(reportNo >= 0 ? <>
        <Typography variant="h6" textAlign="center">
            レポートを送信しました。
        </Typography>
        <Box fontSize={12}>
            レポート番号:
        </Box>
        <Box
            textAlign="center"
            fontSize={isPc ? 40 : 20}
            px={1}
            py={2}
            color={theme => theme.palette.primary.main}
            sx={{ overflowWrap: "break-word" }}
        >
            {reportNo}
        </Box>
        <Typography variant="body2">
            レポート番号は後にサポートを受けるために必要なレポートの識別番号です。
            保管することをお勧めします。
        </Typography>
    </> : <>
        <Typography variant="h6" textAlign="center">
            レポートの送信に失敗しました。
        </Typography>
        <Typography variant="body2">
            もう一度送り直してください。
        </Typography>
    </>);
    const handleSendError = useCallback(async () => {
        const reportNo = await sendLogs(logs)
        setReportNo(reportNo);
        confirm();
    }, [logs]);
    const menuItems = useMemo(() => [
        { label: "全てのメニュー", },
        "hr",
        {
            label: "エラーレポートを送信",
            onSelect: handleSendError,
        }
    ] as const, [handleSendError]);
    return (
        <>
            <IconButton onClick={handleOpen}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchor}
                open={open}
                onClose={handleClose}
            >
                {menuItems.map((menuItem, i) => (
                    menuItem === "hr" ?
                        <Divider orientation="horizontal" key={menuItem + i} />
                        :
                        (menuItem as any).onSelect ?
                            <MenuItem
                                key={menuItem.label}
                                onClick={handleSelectMenuItem((menuItem as any).onSelect)}
                            >
                                {menuItem.label}
                            </MenuItem>
                            :
                            <MenuItem disabled key={menuItem.label}>
                                {menuItem.label}
                            </MenuItem>
                ))}
            </Menu>
            <ConfirmDialog {...confirmProps}>

            </ConfirmDialog>
        </>
    );
}

const LeftTopMenu: FC<{}> = () => {
    const [open, setOpen] = useState(false);
    const [title] = useTitle();
    const [confirm, dialogProps] = useConfirmDialog(
        "本当に初期化してもいいですか？この操作は取り消すことができません!"
    );
    const dispatch = useDispatch();
    const { resetChangeCount } = useChange();
    const [
        ,
        selectTargetDialogProps, {
            open: openTargetSelectDialog,
        }] = useUtilDialog({});
    const [target, setTarget] = useState<(EnableTarget)>("javascript");

    const handleSave = () => {
        setOpen(false);
        saveToBrowser();
        resetChangeCount();
    };
    const handleDownload = () => {
        setOpen(false);
        const saveFormat = storeStateToJson();
        downloadTextFile(saveFormat, title + ".fbe");
    };
    const handleImport = async () => {
        setOpen(false);
        const text = await getFileText();
        loadJson(JSON.parse(text));
    };
    const handleNew = () => {
        setOpen(false);
        //reset
        resetBrowserSave();
        dispatch(resetMeta());
        dispatch(resetItems());
        resetChangeCount();
    };
    const handleDownloadImage = () => {
        donwloadImage(title);
    };
    return (
        <>
            <IconButton color="inherit" onClick={() => setOpen(true)}>
                <MenuIcon />
            </IconButton>

            <Drawer open={open} onClose={() => setOpen(false)}>
                <Grow in={open} timeout={1300}>
                    <Typography variant="h4" sx={{ px: 1, py: 2 }}>
                        Flowchart <br />
                        Build <br />
                        Executor
                    </Typography>
                </Grow>
                <List>
                    <ListItem sx={{ textAlign: "right" }}>
                        <Box sx={{ width: "100%" }}>
                            バージョン : {VERSION}
                        </Box>
                    </ListItem>
                    <ListItem button onClick={confirm}>
                        <ListItemIcon>
                            <FiberNewIcon />
                        </ListItemIcon>
                        新規作成
                    </ListItem>
                    <ListItem button onClick={handleSave}>
                        <ListItemIcon>
                            <SaveIcon />
                        </ListItemIcon>
                        保存
                    </ListItem>

                    <ListItem button onClick={handleDownload}>
                        <ListItemIcon>
                            <CloudDownloadIcon />
                        </ListItemIcon>
                        ダウンロード
                    </ListItem>

                    <ListItem button onClick={handleImport}>
                        <ListItemIcon>
                            <CloudUploadIcon />
                        </ListItemIcon>
                        インポート
                    </ListItem>

                    <Divider />

                    <ListItem>
                        エクスポート
                    </ListItem>

                    <ListItem button onClick={handleDownloadImage}>
                        <ListItemIcon>
                            <ImageIcon />
                        </ListItemIcon>
                        画像としてエクスポート
                    </ListItem>

                    <ListItem button onClick={openTargetSelectDialog}>
                        <ListItemIcon>
                            <ChangeCircleIcon />
                        </ListItemIcon>
                        プログラムに変換
                    </ListItem>

                    <Divider />

                    <ListItem>
                        ヘルプ・ドキュメント
                    </ListItem>

                    <ListItem button component="a" href={FBE_DOC_URL} target="_blank">
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        ホームページへ
                    </ListItem>

                    <ListItem button component="a" href={FBE_DOC_URL + "/docs"} target="_blank">
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        詳細ドキュメント
                    </ListItem>

                    <ListItem button component="a" href={FBE_DOC_URL + "/credit"} target="_blank">
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        クレジット
                    </ListItem>

                </List>
            </Drawer>

            <ConfirmDialog {...dialogProps} onOk={handleNew} />

            <SelectTarget
                selectTargetDialogProps={selectTargetDialogProps}
                target={target}
                onChangeTarget={target => setTarget(target)}
            />
        </>
    );
};

const Tools: FC<{}> = () => {
    const { resetChangeCount, isExistsChange } = useChange();
    const [mode, setMode] = useMode();
    const [, , incZoom] = useZoom();
    const [selectItemIds] = useSelectItemIds();
    const [, { removeFlow }] = useFlows();
    const { removeItem } = useItemOperations();
    const {
        executeNext,
        canExecuteNext,
        executeAll,
        canExecuteAll,
        stop,
        canStop,
    } = useExecute();
    const handleSave = () => {
        saveToBrowser();
        resetChangeCount();
    };
    const handleToggle = () => {
        if (mode === "edit") {
            setMode("execute");
        }
        if (mode === "execute") {
            setMode("edit");
        }
    };
    const handleZoomIn = () => incZoom(+zoomUnit);
    const handleZoomOut = () => incZoom(-zoomUnit);
    const handleRemoveSelectItem = () => {
        selectItemIds.forEach(id => {
            removeFlow(id);
            removeItem(id);
        });
    };
    return (
        <Stack direction="row" width="100%">
            <Tooltip title="保存する">
                <IconButton onClick={handleSave}>
                    <Badge
                        variant={isExistsChange ? "dot" : "standard"}
                        color="primary"
                    >
                        <SaveIcon color="action" />
                    </Badge>
                </IconButton>
            </Tooltip>
            {/* <Box sx={{ flexGrow: 1 }}></Box> */}
            <Tooltip title={mode === "execute" ? "編集する" : "実行する"}>
                <Button color="primary" variant="text" onClick={handleToggle} sx={{ minWidth: "fit-content" }}>
                    {mode === "execute" ? <EditIcon /> : <PlayArrowIcon />}
                    {mode === "execute" ? "編集する" : "実行する"}
                </Button>
            </Tooltip>
            <Tooltip title="拡大">
                <IconButton onClick={handleZoomIn}>
                    <ZoomIn />
                </IconButton>
            </Tooltip>
            <Tooltip title="縮小">
                <IconButton onClick={handleZoomOut}>
                    <ZoomOut />
                </IconButton>
            </Tooltip>

            <ToolsDivider />

            <OnlyEditMode>
                <Tooltip title="選択中のアイテムを削除">
                    <IconButton onClick={handleRemoveSelectItem}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </OnlyEditMode>

            <OnlyExeMode>
                <Tooltip title="実行">
                    <Button
                        startIcon={<PlayArrowIcon />}
                        color="inherit"
                        onClick={executeNext}
                        disabled={!canExecuteNext}
                        sx={{ minWidth: "fit-content" }}
                    >
                        実行
                    </Button>
                </Tooltip>
                <Tooltip title="全て実行">
                    <Button
                        startIcon={<SkipNextIcon />}
                        color="inherit"
                        onClick={executeAll}
                        disabled={!canExecuteAll}
                        sx={{ minWidth: "fit-content" }}
                    >
                        全て実行
                    </Button>
                </Tooltip>
                <Tooltip title="中止">
                    <Button
                        startIcon={<StopIcon />}
                        color="inherit"
                        onClick={stop}
                        disabled={!canStop}
                        sx={{ minWidth: "fit-content" }}
                    >
                        中止
                    </Button>
                </Tooltip>
            </OnlyExeMode>

        </Stack>
    );
};

interface SelectTargetProps {
    selectTargetDialogProps: UtilDialogProps,
    target: EnableTarget,
    onChangeTarget: (target: EnableTarget) => any,
}
const SelectTarget: FC<SelectTargetProps> = ({
    selectTargetDialogProps,
    target,
    onChangeTarget,
}) => {
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
        onChangeTarget(e.target.value as EnableTarget)
        setProgram(null)
    }
    return (
        <UtilDialog {...selectTargetDialogProps}>
            <DialogTitle>
                フローチャートをプログラムに変換する
            </DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={selectTargetDialogProps.onClose}
                >
                    キャンセル
                </Button>
            </DialogActions>
        </UtilDialog>
    )
};

interface ToolsDividerProps {
}
const ToolsDivider: FC<ToolsDividerProps> = () => {
    return (
        <Divider
            orientation="vertical"
            variant="middle"
            flexItem
        />
    );
}


interface ExpandProps {
}
const Expand: FC<ExpandProps> = () => {
    return (
        <Box sx={{ flexGrow: 1, minHeight: "100%" }}></Box>
    );
}

