import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Option } from "redux/types/item";
import { init } from "./initialState";

//hooks
export function useItems(){
    const items = useSelector((state:{items:typeof init}) => state.items);
    return items ;
}
export function useItem(itemId:string){
    const item = useSelector((state:{items:typeof init})=>state.items[itemId]);
    return item ;
}
export function useGetItem(){
    const items = useItems() ;
    const getItem = useCallback((id :string) => {
        return items[id] ;
    },[items]) ;
    return getItem ;
}
export function useItemOption(itemId:string,name:string){
    const option = useSelector((state:{items:typeof init})=>{
        const options = state.items[itemId].options ;
        const option = options.find(option=>option.name === name) ;
        return option ;
    });
    return option ;
}
export function useGetItemOption() :(id :string, name :string)=>Option<string>|null{
    const getItem = useGetItem() ;
    // return function getItemOption(id :string, name :string) :Option<string>|null{
    //     const item = getItem(id) ;
    //     let ans = null ;
    //     item.options.forEach(ele=>{
    //         if(ele.name === name){
    //             ans = ele ;
    //         }
    //     });
    //     return ans ;
    // }
    const getItemOption = useCallback((id :string, name:string):Option<string>|null=>{
        const item = getItem(id) ;
        let ans = null ;
        item.options.forEach(ele=>{
            if(ele.name === name){
                ans = ele ;
            }
        });
        return ans ;
    },[getItem]) ;
    return getItemOption ;
}

