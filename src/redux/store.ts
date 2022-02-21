import { 
    combineReducers, 
    createStore, 
    compose, 
    applyMiddleware,
    Middleware,
} from "redux";
import { rootReducer } from "./root/reducer";

interface ExtendedWindow extends Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}
declare var window: ExtendedWindow;
const composeReduxDevToolsEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;



const middlewares = [] as Middleware[] ;

export const store = createStore(
    rootReducer,
    undefined,
    composeReduxDevToolsEnhancers(applyMiddleware(...middlewares))
) ;
export type StoreState = ReturnType<typeof store.getState> ;



