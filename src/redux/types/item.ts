import React from "react";
import { OptionType } from "util/syms";
import {Executable} from "exe/runtimes/Runtime" ;

export interface Option<V> {
    name: string;
    value: V;
    type: OptionType; //optionType のキーのみ
    args?: any;
    visible: boolean;
}
export interface Item {
    itemType :string;
    component: any;
    syms?: string[];
    options: Option<any>[];
    menus: {name:string, component:React.FC[]}[];
    execute :Executable;

}
export interface Items{
    [key:string]:Item
}


