import { Button } from "@material-ui/core";
import { Done, DoneAll, Delete } from "@material-ui/icons";
import Runtime from "exe/runtimes/Runtime";
import { useDispatch } from "react-redux";
import { removeItem } from "redux/reducers/items";
import {
    useSelectItemIds,
    useSelectItemId,
    selectItemById,
} from "redux/reducers/selectItem";
import { useTopFlows, removeTopFlow } from "redux/reducers/top";
import { Item, Option } from "redux/types/item";
import { OptionType } from "util/syms";
import { store } from "redux/store" ;

interface baseItemComponentProps {
    item: Item;
    id: string;
}
const DeleteSymMenu = () => {
    const selectItemIds = useSelectItemIds();
    const topFlows = useTopFlows();
    const dispatch = useDispatch();
    const handleRemove = () => {
        //console.log(selectItemIds);
        selectItemIds.forEach((id) => {
            dispatch(removeItem(id));
            if (topFlows.includes(id)) {
                dispatch(removeTopFlow(id));
            }
        });
    };
    return (
        <Button
            startIcon={<Delete />}
            onClick={handleRemove}
            color="primary"
            variant="outlined"
        >
            記号を削除
        </Button>
    );
};
const UnselectSymMenu = () => {
    const selectItemId = useSelectItemId();
    const dispatch = useDispatch();
    const handleUnselect = () => {
        dispatch(selectItemById(selectItemId));
    };
    return (
        <Button
            startIcon={<Done />}
            onClick={handleUnselect}
            color="primary"
            variant="outlined"
        >
            選択解除
        </Button>
    );
};
const UnselectAllSymMenu = () => {
    const dispatch = useDispatch();
    const handleUnselectAll = () => {
        dispatch(selectItemById("none"));
    };
    return (
        <Button
            startIcon={<DoneAll />}
            onClick={handleUnselectAll}
            color="primary"
            variant="outlined"
        >
            全て選択解除
        </Button>
    );
};

export function baseItemCreator(
    itemType: string,
    component: (props: baseItemComponentProps) => React.ReactNode,
    options: Option<any>[]
): Item {
    // const defMenus = [
    //     //delete
    //     {
    //         name: "記号の操作",
    //         component: [DeleteSymMenu],
    //     },
    //     //select
    //     {
    //         name: "記号の選択",
    //         component: [UnselectSymMenu, UnselectAllSymMenu],
    //     },
    // ];
    const defMenus = [
        {
            label: "記号の削除",
            onClick: () => {
                //# selectItemIdx, dispatch , topFlows
                
                // const selectItemIds = useSelectItemIds();
                // const topFlows = useTopFlows();
                // const dispatch = useDispatch();
                const state = store.getState() ;
                const selectItemIds = state.selectItem.ids ;
                const topFlows = state.top.flows ;
                const dispatch = store.dispatch ;
                selectItemIds.forEach((id) => {
                    dispatch(removeItem(id));
                    if (topFlows.includes(id)) {
                        dispatch(removeTopFlow(id));
                    }
                });
            }, 
            icon: <Delete />,
        },
        {
            label: "選択解除",
            onClick: () => {
                // alert("Delete");
                const selectItemId = store.getState().selectItem.id ;
                store.dispatch(selectItemById(selectItemId));
            }, 
            icon: <Done />,
        },
        {
            label: "全て選択解除",
            onClick: () => {
                // alert("Delete");
                store.dispatch(selectItemById("none"));
            }, 
            icon: <DoneAll />,
        },
    ];
    async function execute(e: Runtime, item: Item) {
        //console.log("exe",item);
    }
    return {
        itemType,
        component,
        options,
        menus: defMenus,
        execute,
    };
}

export function optionCreator<V>(
    name: string,
    value: V,
    type: OptionType,
    args?: any,
    visible: boolean | ((item: Item) => boolean) = true
): Option<V> {
    const ans: Option<V> = {
        name,
        value,
        type,
        isVisible: visible instanceof Function ? visible : (item) => visible,
    };

    if (args) {
        ans.args = args;
    }
    return ans;
}
