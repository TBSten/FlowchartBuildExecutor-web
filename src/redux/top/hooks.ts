import { useSelector, useDispatch } from "react-redux";
import { ArrayTemplate } from "redux/types/top";
import { setTitle } from "./actions";
import { init } from "./initialState";


//hooks
export function useTopFlows(){
    const topFlows = useSelector((state:{top:{flows:string[]}}) => state.top.flows);
    return topFlows ;
}
export function useTopArrayTemplates() {
    const topAT = useSelector((state:{top:typeof init}) => state.top.arrayTemplates ) ;
    // console.log(useSelector((s:any)=>s));
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
export function useTitle(){
    const title = useSelector((state:{top:typeof init})=>state.top.title);
    const dispatch = useDispatch();
    function set(newTitle: string){
        dispatch(setTitle(newTitle));
    }
    return [title,set] as const ;
}
