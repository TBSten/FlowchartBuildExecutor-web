import {actionTypes} from "../actions" ;

const init = {
    value:0,
} ;
export default function topReducer(state=init, action:{type :string, payload:any}){
    const newState = Object.assign({},state);
    switch(action.type){
        case actionTypes.mode.set:
            break;
    }
    return newState ;
}

