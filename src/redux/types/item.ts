import { OptionType } from "util/syms";

export interface Option<V> {
    name: string;
    value: V;
    type: OptionType; //optionType のキーのみ
    args?: any;
}
export interface Item {
    component: any;
    syms?: string[];
    options: Option<any>[];
}
export interface Items{
    [key:string]:Item
}
