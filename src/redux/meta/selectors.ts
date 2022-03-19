import { StoreState } from "../store";

export function getTitle() {
    return (state: StoreState) => state.meta.title;
}

export function getFlowIds() {
    return (state: StoreState) => state.meta.flowIds;
}

