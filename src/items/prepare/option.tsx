
import { FC } from "react";
import { useSym } from "src/redux/items/hooks";
import { getItem } from "src/redux/items/selectors";
import { isSym } from "src/redux/items/types";
import { useAppSelector } from "src/redux/root/hooks";
import { DefaultOptionEditorRow, getOption, OptionEditorProps } from "../option";


const PrepareOptionEditor: FC<OptionEditorProps> = ({ symId, }) => {
    const [sym] = useSym(symId);
    const options = useAppSelector(state => {
        const item = getItem(symId)(state);
        if (isSym(item)) {
            return item.options;
        }
    });
    const typeOption = getOption(sym, "種類");
    const countOption = getOption(sym, "要素数");
    return (
        <>
            {options?.map(option => (
                <DefaultOptionEditorRow
                    itemId={symId}
                    name={option.name}
                    key={option.name}
                />
            ))}
        </>
    );
}

export default PrepareOptionEditor;
