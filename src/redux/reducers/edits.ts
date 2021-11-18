import { useDispatch, useSelector } from "react-redux";
import { actionTypes } from "../actions";

const init = {
  zoom: 1.0,
  clipboard:[] as string[], //削除可能
  dragAndDrop:{
    from:"",
    to:"",
  },

};
export default function editsReducer(
  state = init,
  action: { type: string; payload: any }
) {
  const newState = Object.assign({}, state);
  const value: number = action.payload;
  switch (action.type) {
    case actionTypes.edit.zoom.set:
      newState.zoom = value;
      break;
    case actionTypes.edit.zoom.inc:
      const newZoom = newState.zoom + value;
      if (0 <= newZoom && newZoom < 2) {
        newState.zoom = newZoom;
      }
      break;
    case actionTypes.edit.clipboard.set:
      newState.clipboard = [...action.payload];
      break;
    case actionTypes.edit.clipboard.unset:
      newState.clipboard = [] ;
      break;
    case actionTypes.edit.dragAndDrop.from.set:
      newState.dragAndDrop.from = action.payload ;
      break;
    case actionTypes.edit.dragAndDrop.to.set:
      newState.dragAndDrop.to = action.payload ;
      break;

  }
  return newState;
}

//actionCreators
export function setZoom(value: number) {
  return {
    type: actionTypes.edit.zoom.set,
    payload: value,
  };
}
export function incZoom(value: number) {
  return {
    type: actionTypes.edit.zoom.inc,
    payload: value,
  };
}
export function setClipboard(ids:string[]){
  return {
    type: actionTypes.edit.clipboard.set,
    payload:ids,
  } ;
}
export function unsetClipboard(){
  return {
    type: actionTypes.edit.clipboard.set,
    payload:"none",
  } ;
}
export function setDragAndDropFrom(itemId:string){
  return {
    type: actionTypes.edit.dragAndDrop.from.set,
    payload: itemId,
  } ;
}
export function setDragAndDropTo(itemId:string){
  return {
    type: actionTypes.edit.dragAndDrop.to.set,
    payload: itemId,
  } ;
}

//hooks
export function useZoom() {
  const zoom = useSelector(
    (state: { edits: typeof init }) => state.edits.zoom
  );
  return zoom;
}
export function useClipboard(){
  const clipboard = useSelector(
    (state: { edits: typeof init }) => state.edits.clipboard
  );
  const dispatch = useDispatch();
  function set(ids:string[]){
    dispatch(setClipboard(ids));
  }
  function unset(){
    dispatch(unsetClipboard());
  }
  return {
    clipboard,
    set,
    unset,
  } ;
}
export function useDragAndDrop(){
  const {from,to} = useSelector((state:{edits:typeof init})=>state.edits.dragAndDrop);
  const dispatch = useDispatch();
  function setFrom(itemId:string){
    dispatch(setDragAndDropFrom(itemId));
  }
  function setTo(itemId:string){
    dispatch(setDragAndDropTo(itemId));
  }
  return {
    from,
    to,
    setFrom,
    setTo,
  } ;
}
