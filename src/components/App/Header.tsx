import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import HomeIcon from "@mui/icons-material/Home";
import ImageIcon from "@mui/icons-material/Image";
import MenuIcon from "@mui/icons-material/Menu";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import ZoomIn from "@mui/icons-material/ZoomIn";
import ZoomOut from "@mui/icons-material/ZoomOut";
import { Grow, MenuItem, Stack } from "@mui/material";
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
import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import {
    loadJson, resetBrowserSave, saveToBrowser, storeStateToJson
} from "src/format";
import { FBE_DOC_URL } from "src/lib/constants";
import { EnableTarget, enableTargets, fbeToProgram } from "src/lib/fbeToProgram";
import { downloadTextFile, getFileText } from "src/lib/file";
import { donwloadImage } from "src/lib/image";
import { useChange, useMode, useZoom } from "src/redux/app/operations";
import { resetItems } from "src/redux/items/actions";
import { resetMeta } from "src/redux/meta/actions";
import { useTitle } from "src/redux/meta/operations";
import ConfirmDialog, { useConfirmDialog } from "../util/ConfirmDialog";
import ProgramConvertView from "./ProgramConvertView";
import UtilDialog, { useUtilDialog, UtilDialogProps } from "./UtilDialog";

// import { StoreState } from "src/redux/store";

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
                <HeaderMenu />
                <Title />
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
    return (
        <InputBase
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ color: "inherit", flexGrow: 1 }}
        />
    );
};

const HeaderMenu: FC<{}> = () => {
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
                            <ImageIcon />
                        </ListItemIcon>
                        プログラムに変換
                    </ListItem>

                    <Divider />

                    <ListItem>
                        ドキュメント
                    </ListItem>

                    <ListItem button component="a" href={FBE_DOC_URL} target="_blank">
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        ホームページへ
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
    // const runtime = useSelector((state:StoreState)=>state.app.runtime);
    const [, , incZoom] = useZoom();
    const handleSave = () => {
        saveToBrowser();
        resetChangeCount();
    };
    const handleExecute = () => {
        if (mode === "edit") {
            setMode("execute");
        }
        if (mode === "execute") {
            // runtime?.executeNext();
            setMode("edit");
        }
    };
    const handleZoomIn = () => incZoom(+0.05);
    const handleZoomOut = () => incZoom(-0.05);
    return (
        <Toolbar >
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
            <Box sx={{ flexGrow: 1 }}></Box>
            <Tooltip title={mode === "execute" ? "編集する" : "実行する"}>
                <IconButton onClick={handleExecute}>
                    {mode === "execute" ?
                        <EditIcon />
                        :
                        <PlayArrowIcon />
                    }
                </IconButton>
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
        </Toolbar>
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
    const [program, setProgram] = useState<null | string>(null);
    const handleFBEToProgram = async () => {
        try {
            const start = new Date();
            const program = await fbeToProgram(target);
            const end = new Date();
            console.log(program);
            console.log("took", end.valueOf() - start.valueOf());
            setProgram(program);
        } catch (e) {
            console.error(e);
            alert("エラーが発生しました");
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
                    <Button variant={program === null ? "contained" : "text"} onClick={handleFBEToProgram}>
                        {program === null ? "" : "もう一度"}
                        変換する
                    </Button>
                    {typeof program === "string" ?
                        <ProgramConvertView target={target}>{program}</ProgramConvertView>
                        : ""}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={selectTargetDialogProps.onClose}>キャンセル</Button>
            </DialogActions>
        </UtilDialog>
    )
};


