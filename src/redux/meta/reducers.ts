import { reducerWithInitialState } from "typescript-fsa-reducers";
import { ItemId } from "../items/types";
import * as actions from "./actions";
import { Meta } from "./types";

const init: Meta = {
    flowIds: [] as ItemId[],
    title: "タイトル未設定",
};

export const meta = reducerWithInitialState(init)
    .case(actions.setTitle, (state, payload) => {
        if (state.title === payload.title) return state;
        return {
            ...state,
            title: payload.title,
        };
    })
    .case(actions.addFlow, (state, payload) => {
        return {
            ...state,
            flowIds: [
                ...state.flowIds,
                payload.flowId,
            ]
        };
    })
    .case(actions.removeFlow, (state, payload) => {
        return {
            ...state,
            flowIds: state.flowIds.filter(id => id !== payload.flowId)
        };
    })
    .case(actions.loadMeta, (state, payload) => {
        // return payload.meta;
        const ans :Meta = {
            title:payload.meta.title,
            flowIds:payload.meta.flowIds,
        };
        return ans;
    })
    .case(actions.resetMeta, () => {
        return init;
    })

