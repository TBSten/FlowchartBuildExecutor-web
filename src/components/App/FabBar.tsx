import Fab from "@material-ui/core/Fab" ;
import Dialog from "@material-ui/core/Dialog" ;
import DialogTitle from "@material-ui/core/DialogTitle" ;
import List from "@material-ui/core/List" ;
import ListItem from "@material-ui/core/ListItem" ;
import ListItemText from "@material-ui/core/ListItemText" ;
import Container from "@material-ui/core/Container" ;
// import IconButton from "@material-ui/core/IconButton" ;
import {makeStyles} from "@material-ui/core" ;
import PlayArrow from "@material-ui/icons/PlayArrow" ;
import ZoomIn from "@material-ui/icons/ZoomIn" ;
import ZoomOut from "@material-ui/icons/ZoomOut" ;
import { useDispatch } from "react-redux";
import {setMode} from "redux/app/actions" ;
import {useMode} from "redux/app/hooks" ;
import { Edit } from "@material-ui/icons";
import { useRuntime } from "redux/app/hooks";
import { setRuntime, setExecutingId } from "redux/app/actions";
import { runtimes } from "exe/runtimes" ;
import Runtime from "exe/runtimes/Runtime";
import { useTopFlows } from "redux/top/hooks";
import { incZoom } from "redux/app/actions";
import { useSp } from "css/media";


const useStyles = makeStyles({
    root :{
        position: "fixed" ,
        right: "25px",
        bottom: "10px",
        zIndex: 10,
        padding: 0,
        // display:"grid",
        // gridTemplateRows:"1fr",
        // gridAutoFlow:"column",
        // gap:"10px",
        // alignItems:"center",
        display:"flex",
        flexDirection:"row",
        justifyContent:"flex-end",
        alignItems:"center",
        flexWrap:"wrap",
        width:"auto",
        gap:"10px",
    },
    maxWidthMd:{
        gridTemplateRows:"auto",
        gridTemplateColumns:"1fr",
        gridAutoFlow:"row",
        justifyItems:"end",
    },
});

export default function ExeButton(){
    const classes = useStyles();
    const dispatch = useDispatch();
    const mode = useMode();
    const runtime = useRuntime();
    const topFlows = useTopFlows();
    const isSp = useSp();

    function handleExeMode(){
        // console.log("exe mode");
        if(mode === "edit"){
            dispatch(setMode("exe"));
        }else if(mode === "exe"){
            if(runtime){
                runtime.status = "done" ;
            }
            dispatch(setRuntime(null));
            dispatch(setMode("edit"));
        }else{
            console.error("ERROR mode :",mode);
        }
    }
    function selectRuntime(runtime :Runtime,e :React.MouseEvent){
        e.preventDefault();
        e.stopPropagation();
        dispatch(setRuntime(runtime));
        dispatch(setExecutingId("none"));
    }
    function handleExeNext(){
        if(runtime){
            runtime.next();
            dispatch(setRuntime(runtime))
        }
    }
    return (
        <Container classes={classes} >

            <Fab 
                color="primary" 
                size="small" 
                onClick={()=>dispatch(incZoom(+0.1))}>
                <ZoomIn />
            </Fab>

            <Fab 
                color="primary" 
                size="small" 
                onClick={()=>dispatch(incZoom(-0.1))}>
                <ZoomOut />
            </Fab>

            {mode==="exe"?
                <>

                <Fab 
                    color="primary" 
                    onClick={handleExeNext} 
                    disabled={runtime?.isExited()}
                    size={isSp?"small":"medium"}>
                    <PlayArrow />
                </Fab>

                </>
            :""}

            <Fab 
                variant="extended" 
                color="primary" 
                onClick={handleExeMode}
                size={isSp?"small":"large"}>
                {
                mode==="edit"?
                    <>
                        <PlayArrow />
                        実行
                    </>
                :
                mode==="exe"?
                    <>
                        <Edit />
                        編集
                        <Dialog open={runtime===null}>
                            <DialogTitle> ダイアログ </DialogTitle>
                            <List>
                                {
                                    runtimes.map(el=>{
                                        const runtime = new el(topFlows,[]) ;
                                        return (
                                            <ListItem button onClick={(e)=>selectRuntime(runtime,e)} key={runtime.name}>
                                                <ListItemText>{runtime.name}</ListItemText>
                                            </ListItem>
                                        ) ;
                                    })
                                }

                            </List>
                        </Dialog>
                    </>
                :
                "ERROR !"
                }
                
            </Fab>
        </Container>
    ) ;
}

