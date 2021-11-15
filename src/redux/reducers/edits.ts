import { useDispatch, useSelector } from "react-redux";
import { actionTypes } from "../actions";

const init = {
  zoom: 1.0,
  clipboard:[] as string[],
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
  }
  return newState;
}
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

