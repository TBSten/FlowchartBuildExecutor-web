


//actionTypes
const items = {
    add:"items/add",
    set:"items/set",
    remove:"items/remove",
    option:{
        set:"items/option/set",
    },
    sym:{
        add:"items/sym/add",
        remove:"items/sym/remove",
    }
} ;
const top = {
    flow:{
        add:"top/flows/add",
        remove:"top/flows/remove",
    },
} ;
const selectItem = {
    select:"selectItem/select",
    unselect:"selectItem/unselect",
    toggleMulti:"selectItem/toggleMulti",
} ;
const mode={
    set:"mode/set",
} ;

export const actionTypes = {
    items,
    top,
    selectItem,
    mode,
} ;


