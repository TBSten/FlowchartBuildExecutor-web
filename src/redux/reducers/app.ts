import {Action,} from "../types/action" ;
import { useDispatch, useSelector } from "react-redux";
import {actionTypes} from "../actions" ;

const init:{
    dialog:{
        open:boolean,
        content:React.ReactNode,
        onClose:()=>void,
    },
} = {
    dialog:{
        open:false,
        content:"",
        onClose:()=>{},
    },
} ;
export default function appReducer(state=init, action:{type :string, payload:any}){
    //console.log("app reducer");
    //console.log(state);
    let newState = Object.assign({},state);
    if(action.type === actionTypes.app.dialog.show){
        newState.dialog.open = true ;
        newState.dialog.content = action.payload ;
    }else if(action.type === actionTypes.app.dialog.hide){
        newState.dialog.open = false ;
        newState.dialog.content = "" ;
    }else if(action.type === actionTypes.app.dialog.setOnClose){
        newState.dialog.onClose = action.payload ;
    }
    //console.log(newState);
    //console.log(state === newState);
    return newState ;
}


//actionCreators
export function openAppDialog(content:React.ReactNode) :Action{
    return {
        type:actionTypes.app.dialog.show,
        payload:content,
    } ;
}
export function hideAppDialog() :Action{
    return {
        type:actionTypes.app.dialog.hide,
    } ;
} ;
export function setOnCloseAppDialog(onClose:()=>void) :Action{
    return {
        type:actionTypes.app.dialog.setOnClose,
        payload:onClose,
    } ;
} ;

//hooks
/*
const [isOpen,{show,hide}] = useOpenAppDialog() ;
show(<div> TEST </div>);
hide();
*/
export function useAppDialog(){
    useSelector((state:{app:typeof init}) => state.app.dialog.content);
    const dialog = useSelector((state:{app:typeof init}) => state.app.dialog);
    const dispatch = useDispatch();
    function show(content:React.ReactNode){
        dispatch(openAppDialog(content));        
    }
    function hide(){
        dispatch(hideAppDialog());
    }
    //console.log();
    return {
        ...dialog,
        show,hide
    } ;
}


