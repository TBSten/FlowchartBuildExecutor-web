import { useDispatch } from "react-redux";
import { ItemId } from "../items/types";
import { addFlow, removeFlow, setTitle, } from "./actions";
import { getTitle, getFlowIds } from "./selectors";
import { useAppSelector } from "src/redux/root/operations";

export function useTitle() {
    const title = useAppSelector(getTitle());
    const dispatch = useDispatch();
    const set = (title: string) => {
        dispatch(setTitle({ title }));
    };
    return [
        title,
        set,
    ] as const;
}
export function useFlows() {
    const flowIds = useAppSelector(getFlowIds());
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
            addFlow: add,
            removeFlow: remove,
        }
    ] as const;
}

