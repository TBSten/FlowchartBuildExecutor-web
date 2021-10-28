import Fab from "@material-ui/core/Fab" ;
import Dialog from "@material-ui/core/Dialog" ;
import DialogTitle from "@material-ui/core/DialogTitle" ;
import List from "@material-ui/core/List" ;
import ListItem from "@material-ui/core/ListItem" ;
import ListItemText from "@material-ui/core/ListItemText" ;
import {makeStyles} from "@material-ui/core" ;
import PlayArrow from "@material-ui/icons/PlayArrow" ;
import { useDispatch } from "react-redux";
import {setMode,useMode} from "redux/reducers/mode" ;
import { Edit } from "@material-ui/icons";
import { useRuntime, setRuntime, setExecutingId } from "redux/reducers/exes";
import { runtimes } from "exe/runtimes" ;
import Runtime from "exe/runtimes/Runtime";
import { useTopFlows } from "redux/reducers/top";

const useStyles = makeStyles({
    root :{
        position: "fixed" ,
        right: "25px",
        bottom: "10px",
        zIndex: 10,
    },
});

export default function ExeButton(){
    const classes = useStyles();
    const dispatch = useDispatch();
    const mode = useMode();
    const runtime = useRuntime();
    const topFlows = useTopFlows();
    function handleExeMode(){
        // console.log("exe mode");
        if(mode === "edit"){
            dispatch(setMode("exe"));

        }else if(mode === "exe"){
            dispatch(setRuntime(null));
            dispatch(setMode("edit"));
        }else{
            console.error("ERROR mode :",mode);
        }
    }
    function selectRuntime(runtime :Runtime,e :React.MouseEvent){
        // console.log("set runtime :",runtime);
        e.preventDefault();
        e.stopPropagation();
        dispatch(setRuntime(runtime));
        dispatch(setExecutingId("none"));
    }
    return (
        <Fab variant="extended" color="primary" classes={{root : classes.root}}
            onClick={handleExeMode}>
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
    ) ;
}

