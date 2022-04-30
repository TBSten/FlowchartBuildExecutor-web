
import actionCreatorFactory from "typescript-fsa" ;
import { ItemId } from "../items/types";
import { Meta } from "./types";

const actionCreator = actionCreatorFactory("meta") ;

export const setTitle = actionCreator<{title:string}>("title/set") ;
export const addFlow = actionCreator<{flowId:ItemId}>("flows/add") ;
export const removeFlow = actionCreator<{flowId:ItemId}>("flows/remove") ;

export const loadMeta = actionCreator<{ meta : Meta }>("load");
export const resetMeta = actionCreator("reset");
