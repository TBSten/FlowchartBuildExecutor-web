import { useState, } from "react" ;
import {store} from "redux/store" ;
import {
    AppBar, 
    Toolbar,
    Typography,
    IconButton,
    // Button,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListSubheader ,
} from "@material-ui/core";
import {
    Menu as MenuIcon,
    // ZoomIn,
    // ZoomOut,
    // Search,
    InsertDriveFile,
    Save,
    ViewArray,
    CloudDownload,
    CloudUpload,
} from "@material-ui/icons";
import { useDispatch } from "react-redux";
// import { setZoom, incZoom } from "redux/reducers/edits";
import styled from "styled-components" ;
import {sp} from "css/media" ;
import {
    clearBrowserSave,
    saveBrowserSaveData,
    downloadSaveState,
    loadSaveStateFromLocalFile,
 } from "util/io" ;
import { loadItems } from "redux/reducers/items";
import { loadTop, useTitle } from "redux/reducers/top";
import { downloadBp } from "util/html2Image" ;
import InputableText from "components/util/InputableText";


// const ZoomBar = styled.div`
//     color:white;
//     ${sp`
//         display:none;
//     `}
// `;

interface HeadProps{
    isShowSideBar:boolean;
    toggleSideBar:()=>void;
}
export default function Head(props :HeadProps){
    const {toggleSideBar,isShowSideBar,...otherProps} = props ;
    const dispatch = useDispatch() ;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [title,setTitle] = useTitle() ;

    function makeHandleSelectItem(cb:()=>void){
        return function (){
            setDrawerOpen(false);
            cb();
        } ;
    }
    function handleNew(){
        clearBrowserSave();
        dispatch(loadItems( {
            //全削除
        } ));
        dispatch(loadTop( {
            title:"",
            flows:[],
            arrayTemplates:[],
        } ));
    }
    function handleSave(){
        saveBrowserSaveData();
    }
    function handleDownload(){
        downloadSaveState() ;
    }
    async function handleImport(){
        try{
            await loadSaveStateFromLocalFile();
        }catch(e){
            console.error(e);
            alert("ファイルの読み込みに失敗しました");
        }
    }
    function handleExportImg(){
        const state = store.getState();
        const fileName = prompt("ファイル名を設定してください",state.top.title);
        if(fileName){
            downloadBp("png",fileName);
        }
    }
    return (
        <AppBar position="static" {...otherProps}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={()=>{setDrawerOpen(true)}}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" style={{flexGrow:1}}>
                    {/* FBE */}
                    <InputableText value={title} onChange={(newTitle)=>setTitle(newTitle)}/>
                    {/* { title } */}
                </Typography>
                <Drawer anchor="left" open={drawerOpen} onClose={()=>{setDrawerOpen(false)}}>
                    <List>
                        {/* ファイル */}
                        <ListSubheader >
                            ファイル
                        </ListSubheader>
                        <ListItem button onClick={makeHandleSelectItem(handleNew)}>
                            <ListItemIcon>
                                <InsertDriveFile />
                            </ListItemIcon>
                            <ListItemText>
                                新規作成
                            </ListItemText>
                        </ListItem>
                        <ListItem button onClick={makeHandleSelectItem(handleSave)}>
                            <ListItemIcon>
                                <Save />
                            </ListItemIcon>
                            <ListItemText>
                                保存する
                            </ListItemText>
                        </ListItem>
                        <ListItem button onClick={makeHandleSelectItem(handleDownload)}>
                            <ListItemIcon>
                                <CloudDownload />
                            </ListItemIcon>
                            <ListItemText>
                                ダウンロードする
                            </ListItemText>
                        </ListItem>
                        <ListItem button onClick={makeHandleSelectItem(handleImport)}>
                            <ListItemIcon>
                                <CloudUpload />
                            </ListItemIcon>
                            <ListItemText>
                                インポート
                            </ListItemText>
                        </ListItem>

                        {/* エクスポート */}
                        <ListSubheader >
                            エクスポート
                        </ListSubheader>
                        <ListItem button onClick={makeHandleSelectItem(handleExportImg)}>
                            <ListItemIcon>
                                <InsertDriveFile />
                            </ListItemIcon>
                            <ListItemText>
                                画像に変換
                            </ListItemText>
                        </ListItem>

                        {/* サイドバーなどの表示 */}
                        <ListSubheader >
                            表示
                        </ListSubheader>
                        <ListItem button onClick={makeHandleSelectItem(props.toggleSideBar)}>
                            <ListItemIcon>
                                <ViewArray />
                            </ListItemIcon>
                            <ListItemText >
                                サイドバーを
                                {
                                    props.isShowSideBar?
                                    "隠す":"表示"
                                }
                            </ListItemText>
                        </ListItem>
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    ) ;
}
