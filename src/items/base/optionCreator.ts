import { Option, OptionValue } from "src/redux/items/types";

export type OptionCreatorArgs = [
    name: string,
    value: OptionValue,
    opt?: {
        type?: string,
        inputArgs?: Option["inputArgs"],
        visible?: boolean,
    },
];
export default function optionCreator(
    ...[
        name,
        value,
        opt,
    ]: OptionCreatorArgs
): Option {
    const {
        type = "text",
        inputArgs = null,
        visible = true,
    } = opt ?? {};
    return {
        name,
        value,
        type,
        inputArgs,
        visible,
    };
}



