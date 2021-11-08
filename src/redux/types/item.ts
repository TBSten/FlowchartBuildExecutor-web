import React from "react";
import { OptionType } from "util/syms";
import {Executable} from "exe/runtimes/Runtime" ;
import { SideBarMenu } from "components/App/types";

export interface Option<V> {
    name: string;
    value: V;
    type: OptionType; //optionType のキーのみ
    args?: any;
    isVisible: (item:Item)=>boolean;
}
export interface Item {
    itemType :string;
    component: any;
    syms?: string[];
    options: Option<any>[];
    execute :Executable;
    menus:SideBarMenu[] ,
}

export interface Items{
    [key:string]:Item
}


