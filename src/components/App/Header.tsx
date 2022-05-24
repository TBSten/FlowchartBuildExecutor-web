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
import Button, { ButtonProps } from "@mui/material/Button";
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
import { useNavigate } from "react-router-dom";
import { LineIcon, LineShareButton, TwitterIcon, TwitterShareButton } from "react-share";
import {
    resetBrowserSave, saveToBrowser
} from "src/format/browser";
import { saveToServer } from "src/format/share";
import { loadJson, storeStateToJson } from "src/format/util";
import { FBE_DOC_URL, FBE_HUB_URL, FBE_SUPPORT_BACKEND_URL, VERSION } from "src/lib/constants";
import { EnableTarget, enableTargets, useFbeToProgram } from "src/lib/fbeToProgram";
import { downloadTextFile, getFileText } from "src/lib/file";
import { Log, logger } from "src/lib/logger";
import { editMode, executeMode, exportMode, setEmphasisTarget } from "src/redux/app/actions";
import { useChange, useExecute, useLogs, useMode, useSelectItemIds, useZoom } from "src/redux/app/hooks";
import { TO_IMG_KEY, TO_PROGRAM_KEY } from "src/redux/app/lib";
import { zoomUnit } from "src/redux/app/reducers";
import { resetItems } from "src/redux/items/actions";
import { useItemOperations } from "src/redux/items/hooks";
import { resetMeta } from "src/redux/meta/actions";
import { useTitle, useTopFlows } from "src/redux/meta/hooks";
import { usePc } from "src/style/media";
import ConfirmDialog, { useConfirmDialog } from "../util/ConfirmDialog";
import OnlyEditMode from "../util/OnlyEditMode";
import OnlyExeMode from "../util/OnlyExeMode";
import ProgramConvertView from "./ProgramConvertView";
import SidebarContent from "./SidebarContent";
import UtilDialog, { useUtilDialog, UtilDialogProps } from "./UtilDialog";

export interface HeaderProps { }

const Header: FC<HeaderProps> = () => {
    // const { isExistsChange } = useChange();
    useChange();
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
            {String(reportNo).split(/(\d{3})/).filter(s => s).join("-")}
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
    const [
        ,
        shareDialogProps, {
            open: openShareDialog,
        }] = useUtilDialog({ defaultOpen: false, });
    const handleSendError = useCallback(async () => {
        const reportNo = await sendLogs(logs)
        setReportNo(reportNo);
        confirm();
    }, [confirm, logs]);
    const dispatch = useDispatch();
    const handleEditMode = useCallback(() => {
        dispatch(editMode())
    }, [dispatch])
    const handleExeMode = useCallback(() => {
        dispatch(executeMode())
    }, [dispatch])
    const handleExportMode = useCallback(() => {
        dispatch(exportMode())
    }, [dispatch])
    const handleShare = useCallback(() => {
        openShareDialog();
    }, [openShareDialog])
    const menuItems = useMemo(() => [
        { label: "全てのメニュー", },
        "hr",
        {
            label: "編集する",
            onSelect: handleEditMode,
        },
        {
            label: "実行する",
            onSelect: handleExeMode,
        },
        {
            label: "出力する",
            onSelect: handleExportMode,
        },
        "hr",
        {
            label: "フローチャートを共有する",
            onSelect: handleShare,
        },
        {
            label: "エラーレポートを送信",
            onSelect: handleSendError,
        },
    ] as const, [
        handleSendError,
        handleEditMode,
        handleExeMode,
        handleExportMode,
        handleShare,
    ]);
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

            <ShareDialog shareDialogProps={shareDialogProps} />
        </>
    );
}

interface ShareDialogProps {
    shareDialogProps: UtilDialogProps,
}
const ShareDialog: FC<ShareDialogProps> = ({ shareDialogProps, }) => {
    const [shareId, setShareId] = useState<null | string>(null);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setShareId(null);
        if (shareDialogProps.open) {
            saveToServer().then(id => {
                logger.log("save to server id:", id);
                setShareId(id);
            }).catch(e => {
                logger.error(isError)
                setIsError(true);
            })
        }
    }, [shareDialogProps.open]);
    const [title] = useTitle();
    const handleClose = () => {
        const close = shareDialogProps.onClose;
        if (close) close();
    }
    const url = `https://fbe.vercel.app/?shareId=${shareId}`
    const handleCopy = () => {
        if (navigator.clipboard && typeof url === "string") {
            var copyText = url;
            navigator.clipboard.writeText(copyText).then(() => {
                alert('コピーしました。');
            });
        } else {
            alert('対応していません。');
        }
    };
    const handlePublishFBEHub = () => {
        // fbehubへshareId付きで移動
        const url = `${FBE_HUB_URL}?shareId=${shareId}`
        window.open(url, "_blank")
        console.log("url", url);
    }
    return (
        <UtilDialog {...shareDialogProps}>
            <DialogContent key={url}>
                {isError ? "エラーが発生しました" :
                    shareId ? <>
                        <SidebarContent title="FBE-Hub" defaultExpanded>
                            <Typography variant="caption">
                                FBE-HubはFBEで作成したフローチャートをさまざまな人に公開・共有できるサイトです。
                            </Typography>
                            <DialogButton onClick={handlePublishFBEHub} disabled>
                                FBE-Hubで公開する
                            </DialogButton>
                        </SidebarContent>
                        <SidebarContent title="URL" defaultExpanded>
                            <Box sx={{ wordBreak: "break-all" }}>
                                {url}
                            </Box>
                            <DialogButton onClick={handleCopy} >
                                コピー
                            </DialogButton>
                        </SidebarContent>
                        <SidebarContent title="SNSでシェア" defaultExpanded>
                            <TwitterShareButton
                                title={title}
                                url={url}
                                hashtags={["FBE", "フローチャート"]}
                            >
                                <TwitterIcon size={40} />
                            </TwitterShareButton>
                            <LineShareButton
                                url={url}
                                title={title}
                            >
                                <LineIcon size={40} />
                            </LineShareButton>
                        </SidebarContent>
                    </> : (!isError) && "取得中..."
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    閉じる
                </Button>
            </DialogActions>
        </UtilDialog>
    );
}

const DialogButton = (props: ButtonProps) => {
    return (
        <Button
            variant="contained"
            fullWidth sx={{ my: 2 }}
            {...props}
        />
    )
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
        selectTargetDialogProps
    ] = useUtilDialog({});
    const [target, setTarget] = useState<(EnableTarget)>("javascript");

    const handleSave = (() => {
        setOpen(false);
        saveToBrowser();
        resetChangeCount();
    });
    const handleDownload = () => {
        setOpen(false);
        const saveFormat = storeStateToJson();
        downloadTextFile(saveFormat, title + ".fbe");
    };
    const handleImport = (async () => {
        try {
            setOpen(false);
            const text = await getFileText();
            loadJson(JSON.parse(text));
        } catch (e) {
            logger.error("import error", e);
            alert("エラー");
        }
    });
    const handleNew = () => {
        setOpen(false);
        //reset
        resetBrowserSave();
        dispatch(resetMeta());
        dispatch(resetItems());
        resetChangeCount();
        window.location.href = window.location.toString().replace(window.location.search, "")
    };
    const handleDownloadImage = () => {
        setOpen(false);
        saveToBrowser();
        dispatch(exportMode());
        dispatch(setEmphasisTarget({ key: TO_IMG_KEY }));
    };
    const handleToProgram = () => {
        setOpen(false);
        dispatch(exportMode());
        dispatch(setEmphasisTarget({ key: TO_PROGRAM_KEY }));
    }
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

                    <ListItem button onClick={handleToProgram}>
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
    const [, { removeTopFlow: removeFlow }] = useTopFlows();
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
        if (mode === "export") {
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
                    {mode === "edit" ? <PlayArrowIcon /> : <EditIcon />}
                    {mode === "edit" ? "実行する" : "編集する"}
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
                    <IconButton
                        color="inherit"
                        onClick={executeNext}
                        disabled={!canExecuteNext}
                    >
                        <PlayArrowIcon />
                    </IconButton>
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
                    <IconButton
                        color="inherit"
                        onClick={stop}
                        disabled={!canStop}
                    >
                        <StopIcon />
                    </IconButton>
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

