import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Action } from "redux/types/action";
import { deepCopy } from "util/functions";
import {actionTypes} from "../actions" ;

const init:{
    dialog:{
        open:boolean,
        content:React.ReactNode,
        onClose:()=>void,
    },
    snackbar:{
        open:boolean,
        content:React.ReactNode,
        onClose:()=>void,
    },
    isLoading:boolean,
} = {
    dialog:{
        open:false,
        content:"",
        onClose:()=>{},
    },
    snackbar:{
        open:false,
        content:"",
        onClose:()=>{},
    },
    isLoading:true,
} ;
export default function appReducer(state=init, action:{type :string, payload:any}){
    //console.log("app reducer");
    //console.log(state);
    // let newState = Object.assign({},state);
    let newState = deepCopy(state);
    if(action.type === actionTypes.app.dialog.show){
        newState.dialog.open = true ;
        newState.dialog.content = action.payload ;
    }else if(action.type === actionTypes.app.dialog.hide){
        newState.dialog.open = false ;
        newState.dialog.content = "" ;
        //onCloseの発火
        if(state.dialog.open === true ){
            newState.dialog.onClose() ;
        }
        console.log("--- hide ",newState.dialog);
    }else if(action.type === actionTypes.app.dialog.setOnClose){
        newState.dialog.onClose = action.payload ;
    }else if(action.type === actionTypes.app.snackbar.show){
        newState.snackbar.open = true;
        newState.snackbar.content = action.payload ;
    }else if(action.type === actionTypes.app.snackbar.hide){
        newState.snackbar.open = false ;
        newState.snackbar.content = "" ;
        //onCloseの発火
        if(state.snackbar.open === true ){
            newState.snackbar.onClose() ;
        }
    }else if(action.type === actionTypes.app.snackbar.setOnClose){
        newState.snackbar.onClose = action.payload ;
    }else if(action.type === actionTypes.app.isLoading.set ){
        newState.isLoading = action.payload ;
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
        payload:undefined,
    } ;
} ;
export function setOnCloseAppDialog(onClose:()=>void) :Action{
    return {
        type:actionTypes.app.dialog.setOnClose,
        payload:onClose,
    } ;
} ;
export function openAppSnackbar(content:React.ReactNode) :Action{
    return {
        type:actionTypes.app.snackbar.show,
        payload:content,
    } ;
}
export function hideAppSnackbar():Action{
    return {
        type:actionTypes.app.snackbar.hide,
        payload:undefined,
    } ;
}
export function setOnCloseAppSnackbar(onClose:()=>void) :Action{
    return {
        type:actionTypes.app.snackbar.setOnClose,
        payload:onClose,
    } ;
} ;
export function setIsLoading(isLoading:boolean){
    return {
        type :actionTypes.app.isLoading.set,
        payload:isLoading,
    } ;
}
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
export function useAppSnackbar(){
    useSelector((state:{app:typeof init})=>state.app.snackbar);
    const snackbar = useSelector((state:{app:typeof init})=>state.app.snackbar);
    const dispatch = useDispatch();
    function show(content:React.ReactNode){
        dispatch(openAppSnackbar(content));
    }
    function hide(){
        dispatch(hideAppSnackbar());
    }
    return {
        ...snackbar,
        show,hide
    } ;
}
export function useIsLoading(){
    const isLoading = useSelector((state:{app:typeof init})=>state.app.isLoading);
    const dispatch = useDispatch();
    const startLoad = ()=>{
        dispatch(setIsLoading(true));
    } ;
    const finishLoad = ()=>{
        dispatch(setIsLoading(false));
    }
    const heavy = async (callback:()=>Promise<void>)=>{
        startLoad();
        await callback() ;
        finishLoad();
        return ;
    } ;
    return {
        isLoading,
        startLoad,
        finishLoad,
        heavy,
    } ;
}


