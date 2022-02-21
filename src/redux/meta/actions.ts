
import actionCreatorFactory from "typescript-fsa" ;
import { ItemId } from "../items/types";
import { Meta } from "./types";

const actionCreator = actionCreatorFactory() ;

export const setTitle = actionCreator<{title:string}>("meta/title/set") ;
export const addFlow = actionCreator<{flowId:ItemId}>("meta/flows/add") ;
export const removeFlow = actionCreator<{flowId:ItemId}>("meta/flows/remove") ;

export const loadMeta = actionCreator<{ meta : Meta }>("meta/load");
export const resetMeta = actionCreator("meta/reset");
