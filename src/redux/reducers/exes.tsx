import Runtime from "exe/runtimes/Runtime";
import { useSelector } from "react-redux";
import {actionTypes} from "../actions" ;



const init = {
    runtime:null as (null|Runtime),
    executingId:"none",
} ;
export default function exesReducer(state=init, action:{type :string, payload:any}){
    const newState = Object.assign({},state);
    if(action.type === actionTypes.exe.runtime.set){
        const newRuntime = action.payload ;
        newState.runtime = newRuntime ;
    }else if(action.type === actionTypes.exe.executingId.set){
        const newId = action.payload ;
        newState.executingId = newId ;
    }
    return newState ;
}
//action creators
export function setRuntime(runtime :Runtime | null){
    return {
        type:actionTypes.exe.runtime.set,
        payload:runtime,
    } ;
}
export function setExecutingId(id :string){
    return {
        type:actionTypes.exe.executingId.set,
        payload: id,
    } ;
}
//hooks
export function useRuntime(){
    const runtime = useSelector(
        (state:{exes:{runtime:Runtime}}) => state.exes.runtime
    );
    return runtime ;
}
export function useExecutingId(){
    const ans = useSelector(
        (state :{exes:typeof init}) => (state.exes.executingId),
    );
    return ans ;
}



