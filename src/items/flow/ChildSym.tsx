import { FC } from "react";
import ErrorView from "src/components/util/ErrorView";
import { logger } from "src/lib/logger";
import { ItemId } from "src/redux/items/types";
import { useAppSelector } from "src/redux/root/hooks";
import { isSymType, symTypes } from "../symTypes";

export type ChildSymProps = {
    itemId: ItemId;
};
const ChildSym: FC<ChildSymProps> = ({ itemId }) => {
    const itemType = useAppSelector(state => {
        return state.items.find(item => item.itemId === itemId)?.itemType;
    });
    if (!itemType) {
        logger.error("invalid item type", itemType)
        return <div># ERROR UNVALID SYM</div>;
    }
    if (!isSymType(itemType)) return <ErrorView>{itemType} is not itemType</ErrorView>
    const SymComponent = symTypes[itemType].component;
    return (
        <SymComponent itemId={itemId} />
    );
};
export default ChildSym;

