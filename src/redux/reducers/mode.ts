import { Action } from "../types/action";
import {actionTypes} from "../actions" ;
import { useSelector } from "react-redux";

const init = {
    value:"edit",
} ;
export default function topReducer(state=init, action:{type :string, payload:any}){
    const newState = Object.assign({},state);
    switch(action.type){
        case actionTypes.mode.set:
            console.log("mode set",action.payload);
            newState.value = action.payload ;
            break;
    }
    return newState ;
}

//hooks
export function useMode(){
    const mode = useSelector((state:{mode:typeof init}) => state.mode.value);
    return mode ;
}

//actionCreators
export function setMode(newMode :string) :Action{
    return {
        type:actionTypes.mode.set,
        payload:newMode,
    } ;
}

