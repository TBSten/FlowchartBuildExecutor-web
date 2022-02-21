import { Runtime } from "src/execute/runtime/Runtime";
import { Item, Sym, Flow, ItemId } from "src/redux/items/types";
import SymBase from "./base/SymBase";

export type Creator<R> = (itemId: ItemId, parentItemId: ItemId|null)=>R ;
export type ItemCreator = Creator<Item>;
export type SymCreator = Creator<Sym>;
export type FlowCreator = Creator<Flow>;

export type SymComponent = ReturnType<typeof SymBase>;

export type ItemExecute = (args: {
    item: Item;
    runtime: Runtime;
}) => Promise<ReturnItemExecute>;

export type ReturnItemExecute = void | {
    skip?: boolean;
};
