export type ItemId = string;

type PureOptionValue =
    | string
    | number
    | boolean;
export type OptionValue =
    | PureOptionValue
    | PureOptionValue[];

export interface Option {
    name: string;
    value: OptionValue;
    type: string;
    inputArgs?: OptionValue | OptionValue[] | null;
    visible: boolean;
}
export interface Item {
    itemId: ItemId;
    itemType: string;
    childrenItemIds: ItemId[];
    parentItemId: ItemId | null;
    flgs:Record<string,boolean>,
}

export interface Sym extends Item {
    options: Option[];
}

export interface Flow extends Item {
    // childrenSymIds:ItemId[] ;
    tag: string;
}

export type Items = Item[];

export function isItem(arg: any): arg is Item {
    return (
        typeof arg === "object" &&
        typeof arg.itemId === "string" &&
        arg.childrenItemIds instanceof Array
    );
}

export function isSym(arg: any): arg is Sym {
    return (
        typeof arg === "object" && arg.options instanceof Array && isItem(arg)
    );
}

export function isFlow(arg: any): arg is Flow {
    return typeof arg === "object" && isItem(arg);
}
