import { useDispatch } from "react-redux";
import { ItemId } from "../items/types";
import { addFlow, removeFlow, setTitle, } from "./actions";
import { getTitle, getTopFlowIds } from "./selectors";
import { useAppSelector } from "src/redux/root/hooks";
import { useChange } from "../app/hooks";

export function useTitle() {
    const title = useAppSelector(getTitle());
    const { notifyChange } = useChange();
    const dispatch = useDispatch();
    const set = (title: string) => {
        dispatch(setTitle({ title }));
        notifyChange()
    };
    return [
        title,
        set,
    ] as const;
}
export function useTopFlows() {
    const flowIds = useAppSelector(getTopFlowIds());
    const dispatch = useDispatch();
    const add = (flowId: ItemId) => {
        dispatch(addFlow({ flowId }))
    };
    const remove = (flowId: ItemId) => {
        dispatch(removeFlow({ flowId }))
    };
    return [
        flowIds,
        {
            addTopFlow: add,
            removeTopFlow: remove,
        }
    ] as const;
}

