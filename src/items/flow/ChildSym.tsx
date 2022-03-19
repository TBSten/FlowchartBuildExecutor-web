import { FC } from "react";
import ErrorView from "src/components/util/ErrorView";
import { logger } from "src/lib/logger";
import { ItemId } from "src/redux/items/types";
import { useAppSelector } from "src/redux/root/operations";
import { isSymType, symTypes } from "../symTypes";

export type ChildSymProps = {
    itemId: ItemId;
};
const ChildSym: FC<ChildSymProps> = ({ itemId }) => {
    const itemType = useAppSelector(state => {
        const item = state.items.find(item => item.itemId === itemId);
        if (item) {
            return item.itemType;
        }
        return null;
    });
    logger.log(itemType)
    if (!itemType) return <div># ERROR UNVALID SYM</div>;
    if (!isSymType(itemType)) return <ErrorView>{itemType} is not itemType</ErrorView>
    const SymComponent = symTypes[itemType].component;
    return (
        <SymComponent itemId={itemId} />
    );
};
export default ChildSym;

