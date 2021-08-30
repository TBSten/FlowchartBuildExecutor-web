import {actionTypes} from "../actions" ;

const init = {
    flows:["Item-0"],
} ;
export default function topReducer(state=init, action:{type :string, payload:any}){
    const newState = Object.assign({},state);
    switch(action.type){
        case actionTypes.top.flow.add:
            break;
        case actionTypes.top.flow.remove:
            break;
    }
    return newState ;
}

