import { combineReducers } from "redux";
import { items } from "../items/reducers";
import { meta } from "../meta/reducers";
import { app } from "../app/reducers";

const reducers = {
    items,
    meta,
    app,
} ;

const combinedReducer = combineReducers(reducers);

export const rootReducer :typeof combinedReducer = (state,payload) => {
    const newState = combinedReducer(state, payload);
    return newState;
};



