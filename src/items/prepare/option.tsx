
import { FC } from "react";
import { notImplement } from "src/lib/error";
import { useItemOperations, useSym } from "src/redux/items/hooks";
import { getItem } from "src/redux/items/selectors";
import { isSym, Option } from "src/redux/items/types";
import { useAppSelector } from "src/redux/root/hooks";
import { DefaultOptionEditorListItem, getOption, OptionEditorProps } from "../option";


function getErroMsgs(typeOp: Option | null, countOp: Option | null) {
    const ans = {
        type: [] as string[],
        count: [] as string[],
    };
    if (
        typeof typeOp?.value !== "string" ||
        !(["1次元配列", "2次元配列"].includes(typeOp?.value)) ||
        typeof countOp?.value !== "string"
    ) notImplement();
    const counts = countOp.value
        .replace(/\s/g, "")
        .split(/(\*)/g)
        .filter(str => str.match(/^(.+)$/))
    const type = typeOp.value;
    if (type === "1次元配列" && counts.length !== 1) ans.count.push("1次元配列の要素数は「数字」で指定してください");
    if (type === "2次元配列" && counts.length !== 3) ans.count.push("2次元配列の要素数は「縦の要素数*横の要素数」で指定してください");
    return ans;
}
const PrepareOptionEditor: FC<OptionEditorProps> = ({ symId, }) => {
    const [sym] = useSym(symId);
    const { setOption } = useItemOperations();
    const options = useAppSelector(state => {
        const item = getItem(symId)(state);
        if (isSym(item)) {
            return item.options;
        }
    });
    const typeOption = getOption(sym, "種類");
    const countOption = getOption(sym, "要素数");
    const errorMsgs = getErroMsgs(typeOption, countOption)
    return (
        <>
            {options?.map(option => (
                // <DefaultOptionEditorRow
                //     itemId={symId}
                //     name={option.name}
                //     key={option.name}
                // />
                option === typeOption ?
                    <DefaultOptionEditorListItem
                        itemId={symId}
                        key={option.name}
                        option={option}
                        onChangeOptionValue={value => setOption(symId, option.name, value)}
                        description={"配列の数を指定してください"}
                        error={errorMsgs.type[0]}
                    />
                    :
                    option === countOption ?
                        <DefaultOptionEditorListItem
                            itemId={symId}
                            key={option.name}
                            option={option}
                            onChangeOptionValue={value => setOption(symId, option.name, value)}
                            description={"配列の数を指定してください"}
                            error={errorMsgs.count[0]}
                        />
                        :
                        <DefaultOptionEditorListItem
                            itemId={symId}
                            key={option.name}
                            option={option}
                            onChangeOptionValue={value => setOption(symId, option.name, value)}
                            description={""}
                        />
            ))}
        </>
    );
}

export default PrepareOptionEditor;

