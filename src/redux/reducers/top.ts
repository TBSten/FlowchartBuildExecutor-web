import {Action,} from "../types/action" ;
import { useSelector } from "react-redux";
import {actionTypes} from "../actions" ;
import { ArrayTemplate, ArrayTemplates } from "redux/types/top";

const init = {
    flows:[] as string[],
    arrayTemplates:[] as ArrayTemplates,
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
    }else if(action.type === actionTypes.top.arrayTemplates.add){
        const at = action.payload ;
        const oldATs = state.arrayTemplates ;
        newState.arrayTemplates = [...oldATs, at] ;
    }else if(action.type === actionTypes.top.arrayTemplates.update){
        const name = action.payload.name ;
        const at = action.payload.arrayTemplate ;
        newState.arrayTemplates = state.arrayTemplates.reduce((p,v)=>{
            if(v.name === name){
                p.push(at);
            }else{
                p.push(v);
            }
            return p ;
        },[] as ArrayTemplates);
    }else if(action.type === actionTypes.top.arrayTemplates.remove){
        const name = action.payload ;
        newState.arrayTemplates = state.arrayTemplates.reduce((p,v)=>{
            if(v.name !== name){
                p.push(v);
            }
            return p ;
        },[] as ArrayTemplates);
    }else if(action.type === actionTypes.top.load){
        const top = action.payload ;
        newState = {...init,...top} ;
    }
    console.log("top updated :::",newState);
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
export function addTopArrayTemplate(arrayTemplate :ArrayTemplate) :Action{
    return {
        type:actionTypes.top.arrayTemplates.add,
        payload:arrayTemplate,
    } ;
}
export function updateTopArrayTemplate(name :string, arrayTemplate :ArrayTemplate) :Action{
    return {
        type:actionTypes.top.arrayTemplates.update,
        payload:{
            name,
            arrayTemplate,
        },
    } ;
}
export function removeTopArrayTemplate(name :string) :Action{
    return {
        type:actionTypes.top.arrayTemplates.remove,
        payload:name,
    } ;
}
export function loadTop(top :typeof init) :Action{
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
export function useTopArrayTemplates() {
    const topAT = useSelector((state:{top:typeof init}) => state.top.arrayTemplates ) ;
    console.log(useSelector((s:any)=>s));
    return topAT ;
}
export function useTopArrayTemplate(name:string) :ArrayTemplate | null{
    const ats = useTopArrayTemplates();
    let ans :(ArrayTemplate | null) = null ;
    ats.forEach(at => {
        if(at.name === name) ans = at ;
    });
    return ans ;
}

