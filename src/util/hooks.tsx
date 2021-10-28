
import { useEffect, useState, useCallback, ChangeEvent } from "react";

export function useArrayState<V>(init :V[]){
  const [arr,set] = useState<V[]>(init) ;
  function push(ele :V){
    set(prev=>{
      return [...prev, ele] ;
    });
  }
  return [
    arr,
    {
      set,
      push,
    }] ;
}







