import { ArrayTemplate } from "redux/types/top";
import { init } from "./initialState";

export const actionTypes = {
	title:{
		set:"top/title/set",
	},
	flow:{
		add:"top/flows/add",
		remove:"top/flows/remove",
	},
	arrayTemplates:{
		add:"top/arrayTemplates/add",
		remove:"top/arrayTemplates/remove",
		update:"top/arrayTemplates/update",
	},
	load:"top/load",
} ;

//actionCreators
export function addTopFlow(flowId :string) {
    return {
        type:actionTypes.flow.add,
        payload:flowId,
    } ;
}
export function removeTopFlow(flowId :string) {
    return {
        type:actionTypes.flow.remove,
        payload:flowId,
    } ;
}
export function addTopArrayTemplate(arrayTemplate :ArrayTemplate) {
    return {
        type:actionTypes.arrayTemplates.add,
        payload:arrayTemplate,
    } ;
}
export function updateTopArrayTemplate(name :string, arrayTemplate :ArrayTemplate) {
    return {
        type:actionTypes.arrayTemplates.update,
        payload:{
            name,
            arrayTemplate,
        },
    } ;
}
export function removeTopArrayTemplate(name :string) {
    return {
        type:actionTypes.arrayTemplates.remove,
        payload:name,
    } ;
}
export function loadTop(top :typeof init) {
    return {
        type:actionTypes.load ,
        payload:top ,
    } ;
}
export function setTitle(title:string){
    return {
        type:actionTypes.title.set,
        payload:title,
    } ;
}