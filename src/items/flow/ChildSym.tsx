import { FC } from "react";
import { useSelector } from "react-redux";
import ErrorView from "src/components/util/ErrorView";
import { ItemId } from "src/redux/items/types";
import { StoreState } from "src/redux/store";
import { isSymType, symTypes } from "../symTypes";

export type ChildSymProps = {
    itemId: ItemId;
};
const ChildSym: FC<ChildSymProps> = ({ itemId }) => {
    const itemType = useSelector((state: StoreState) => {
        const item = state.items.find(item => item.itemId === itemId);
        if (item) {
            return item.itemType;
        }
        return null;
    });
    console.log(itemType)
    if (!itemType) return <div># ERROR UNVALID SYM</div>;
    if (!isSymType(itemType)) return <ErrorView>{itemType} is not itemType</ErrorView>
    const SymComponent = symTypes[itemType].component;
    return (
        <SymComponent itemId={itemId} />
    );
};
export default ChildSym;

