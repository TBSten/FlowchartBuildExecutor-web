import { useSelector } from "react-redux";
import { actionTypes } from "../actions";

const init = {
  zoom: 1.0,
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
export function useZoom() {
  const zoom = useSelector(
    (state: { edits: { zoom: string } }) => state.edits.zoom
  );
  return zoom;
}
