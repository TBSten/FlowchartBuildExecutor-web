import {Action,} from "../types/action" ;
import { useSelector } from "react-redux";
import {actionTypes} from "../actions" ;

const init = {
    flows:[] as string[],
} ;
export default function topReducer(state=init, action:{type :string, payload:any}){
    let newState = Object.assign({},state);
    if(action.type === actionTypes.top.flow.add){
        const fid = action.payload ;
        newState.flows = [...newState.flows,fid] ;
    }else if(action.type === actionTypes.top.flow.remove){
        const fid = action.payload ;
        newState.flows = newState.flows.reduce((p,v)=>{
            if(fid !== v){
                p.push(v);
            }
            return p ;
        },[] as string[]) ;
    }else if(action.type === actionTypes.top.load){
        const top = action.payload ;
        newState = {...top} ;
    }
    return newState ;
}


//actionCreators
export function addTopFlow(flowId :string) :Action{
    return {
        type:actionTypes.top.flow.add,
        payload:flowId,
    } ;
}
export function removeTopFlow(flowId :string) :Action{
    return {
        type:actionTypes.top.flow.remove,
        payload:flowId,
    } ;
}
export function loadTop(top :typeof init){
    return {
        type:actionTypes.top.load ,
        payload:top ,
    } ;
}

//hooks
export function useTopFlows(){
    const topFlows = useSelector((state:{top:{flows:string[]}}) => state.top.flows);
    return topFlows ;
}
