
import {
    createStore, 
    combineReducers,
    applyMiddleware,
    compose,
} from "redux";
import app from "./app/reducer" ;
import items from "./items/reducer" ;
import top from "./top/reducer" ;

interface ExtendedWindow extends Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}
declare var window: ExtendedWindow;
const composeReduxDevToolsEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = combineReducers({
    app,
    items,
    top,
});

// TODO: 適宜ミドルウェア定義
const middlewares = [] as const;

export const store = createStore( 
    reducer,
    composeReduxDevToolsEnhancers(applyMiddleware(...middlewares)),
);
