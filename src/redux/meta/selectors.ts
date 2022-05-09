import { StoreState } from "../store";

export function getTitle() {
    return (state: StoreState) => state.meta.title;
}

export function getTopFlowIds() {
    return (state: StoreState) => state.meta.flowIds;
}

