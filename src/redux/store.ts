
import {
    createStore, 
    combineReducers,
    applyMiddleware,
    compose,
} from "redux";
import items from "./reducers/items" ;
import top from "./reducers/top" ;
import selectItem from "./reducers/selectItem" ;
import mode from "./reducers/mode" ;
import edits from "./reducers/edits" ;
import exes from "./reducers/exes" ;
import app from "./reducers/app" ;

interface ExtendedWindow extends Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}
declare var window: ExtendedWindow;
const composeReduxDevToolsEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = combineReducers({
    items,
    top,
    selectItem,
    mode,
    edits,
    exes,
    app,
});

// TODO: 適宜ミドルウェア定義
const middlewares = [] as const;

export const store = createStore( 
    reducer,
    composeReduxDevToolsEnhancers(applyMiddleware(...middlewares)),
);
