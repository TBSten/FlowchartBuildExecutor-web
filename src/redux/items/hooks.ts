import { useSelector } from "react-redux";
import { Option } from "redux/types/item";
import { init } from "./initialState";

//hooks
export function useItems(){
    const items = useSelector((state:{items:typeof init}) => state.items);
    return items ;
}
export function useGetItem(){
    const items = useItems() ;
    return function getItem(id :string){
        return items[id] ;
    };
}
export function useGetItemOption() :(id :string, name :string)=>Option<string>|null{
    const getItem = useGetItem() ;
    return function getItemOption(id :string, name :string) :Option<string>|null{
        const item = getItem(id) ;
        let ans = null ;
        item.options.forEach(ele=>{
            if(ele.name === name){
                ans = ele ;
            }
        });
        return ans ;
    }
}

