
import { createStore, combineReducers } from "redux" ;

import items from "./reducers/items" ;
import top from "./reducers/top" ;
import selectItem from "./reducers/selectItem" ;
import mode from "./reducers/mode" ;


const reducer = combineReducers({
    items,
    top,
    selectItem,
    mode,
});

export const store = createStore( reducer );
