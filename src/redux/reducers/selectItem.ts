import {actionTypes} from "../actions" ;

const init = {
    flows:["Item-0"],
} ;
export default function selectItemReducer(state=init, action:{type :string, payload:any}){
    const newState = Object.assign({},state);
    switch(action.type){
        case actionTypes.selectItem.select:
            break;
    }
    return newState ;
}

