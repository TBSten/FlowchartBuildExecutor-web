
import { createStore, combineReducers } from "redux" ;

import items from "./reducers/items" ;
import top from "./reducers/top" ;
import selectItem from "./reducers/selectItem" ;
import mode from "./reducers/mode" ;
import edits from "./reducers/edits" ;


const reducer = combineReducers({
    items,
    top,
    selectItem,
    mode,
    edits,
    
});

export const store = createStore( reducer );
