import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { resetItems } from "src/redux/items/actions";
import { resetMeta } from "src/redux/meta/actions";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { useTitle } from "src/redux/meta/operations";
import InputBase from "@mui/material/InputBase";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import {
    loadJson,
    storeStateToJson,
    saveToBrowser,
    resetBrowserSave,
} from "src/format";
import { downloadTextFile, getFileText } from "src/lib/file";
import ListItemIcon from "@mui/material/ListItemIcon";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import ZoomIn from "@mui/icons-material/ZoomIn";
import ZoomOut from "@mui/icons-material/ZoomOut";
import ConfirmDialog, { useConfirmDialog } from "../util/ConfirmDialog";
import { useChange, useMode, useZoom } from "src/redux/app/operations";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
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
            <Toolbar>
                <Tools />
            </Toolbar>
        </AppBar>
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
    return (
        <>
            <IconButton color="inherit" onClick={() => setOpen(true)}>
                <MenuIcon />
            </IconButton>

            <Drawer open={open} onClose={() => setOpen(false)}>
                <Typography variant="h4" sx={{ px: 1, py: 2 }}>
                    Flowchart <br />
                    Build <br />
                    Executor
                </Typography>
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
                </List>
            </Drawer>

            <ConfirmDialog {...dialogProps} onOk={handleNew} />
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
            <IconButton onClick={handleSave}>
                <Badge
                    variant={isExistsChange ? "dot" : "standard"}
                    color="primary"
                >
                    <SaveIcon color="action" />
                </Badge>
            </IconButton>
            <Box sx={{ flexGrow: 1 }}></Box>
            <IconButton onClick={handleExecute}>
                {mode === "execute" ?
                    <EditIcon />
                    :
                    <PlayArrowIcon />
                }
            </IconButton>
            <IconButton onClick={handleZoomIn}>
                <ZoomIn />
            </IconButton>
            <IconButton onClick={handleZoomOut}>
                <ZoomOut />
            </IconButton>
        </Toolbar>
    );
};
