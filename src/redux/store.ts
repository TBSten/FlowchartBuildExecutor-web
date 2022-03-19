import {
    createStore,
} from "redux";

import { rootReducer } from "./root/reducer";


export const store = createStore(
    rootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);
export type StoreState = ReturnType<typeof store.getState>;

if ((window as any).devToolsExtension) (window as any).devToolsExtension.updateStore(store);
