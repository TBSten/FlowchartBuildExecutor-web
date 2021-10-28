


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
    },
    load:"items/load",
} ;
const top = {
    flow:{
        add:"top/flows/add",
        remove:"top/flows/remove",
    },
    load:"top/load",
} ;
const selectItem = {
    select:"selectItem/select",
    unselect:"selectItem/unselect",
    toggleMulti:"selectItem/toggleMulti",
} ;
const mode={
    set:"mode/set",
} ;
const edit={
    zoom:{
        set:"edit/zoom/set",
        inc:"edit/zoom/inc",
    },
} ;
const exe={
    runtime:{
        set:"exe/runtime/set",
    },
    executingId:{
        set:"exe/executingId/set",
    },
} ;
const app = {
    dialog:{
        show:"app/dialog/show",
        hide:"app/dialog/hide",
        setOnClose:"app/dialog/setOnClose",
    },
} ;

export const actionTypes = {
    items,
    top,
    selectItem,
    mode,
    edit,
    exe,
    app,
} ;


