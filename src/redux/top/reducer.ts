import {actionTypes} from "./actions" ;
import {  ArrayTemplates } from "redux/types/top";
import { init } from "./initialState";

export default function topReducer(state=init, action:{type :string, payload:any}){
    let newState = Object.assign({},state);
    if(action.type === actionTypes.flow.add){
        const fid = action.payload ;
        newState.flows = [...newState.flows,fid] ;
    }else if(action.type === actionTypes.flow.remove){
        const fid = action.payload ;
        newState.flows = newState.flows.reduce((p,v)=>{
            if(fid !== v){
                p.push(v);
            }
            return p ;
        },[] as string[]) ;
    }else if(action.type === actionTypes.arrayTemplates.add){
        const at = action.payload ;
        const oldATs = state.arrayTemplates ;
        newState.arrayTemplates = [...oldATs, at] ;
    }else if(action.type === actionTypes.arrayTemplates.update){
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
    }else if(action.type === actionTypes.arrayTemplates.remove){
        const name = action.payload ;
        newState.arrayTemplates = state.arrayTemplates.reduce((p,v)=>{
            if(v.name !== name){
                p.push(v);
            }
            return p ;
        },[] as ArrayTemplates);
    }else if(action.type === actionTypes.load){
        const top = action.payload ;
        newState = {...init,...top} ;
    }else if(action.type === actionTypes.title.set){
        newState.title = action.payload ;
    }
    // console.log("top updated :::",newState);
    return newState ;
}

