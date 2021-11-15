
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

export function useMultiState<V>(init :V[]){
  const [st,setSt] = useState(init);
  function setAt(idx:number,nv :V){
    setSt((prev)=>prev.map((el,i)=>i===idx?nv:el));
  }
  return [st,setSt,{setAt,}] ;
}

/**
 * ## usage
 * ```
 * const [
 *  open,
 *  setOpen,
 *  handleOpen,
 *  handleClose ] = useBoolState(false);
 * <Button onClick={handleOpen}>open</Button>
 * <Dialog open={open} onClose={handleClose}/>
 * ```
 * @param init 
 * @returns 
 */
export function useBoolState(init :boolean){
  const [st,setSt] = useState(init);
  function setTrue(){
    setSt(true)
  }
  function setFalse(){
    setSt(false)
  }
  return [st,setSt,setTrue,setFalse] ;
}




