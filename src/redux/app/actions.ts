import Runtime from "exe/runtimes/Runtime";

export const actionTypes = {
	dialog:{
		show:"app/dialog/show",
		hide:"app/dialog/hide",
		setOnClose:"app/dialog/setOnClose",
	},
	snackbar:{
		show:"app/snackbar/show",
		hide:"app/snackbar/hide",
		setOnClose:"app/snackbar/setOnClose",
	},
	isLoading:{
		set:"app/isLoading/set",
	},
	
	mode:{
		set:"app/mode/set",
	},
	
	selectItem:{
		select:"app/selectItem/select",
		unselect:"app/selectItem/unselect",
		toggleMulti:"app/selectItem/toggleMulti",
	},
	
	runtime:{
		set:"app/runtime/set",
	},
	executingId:{
		set:"app/executingId/set",
	},
	
	zoom:{
		set:"app/zoom/set",
		inc:"app/zoom/inc",
	},
	clipboard:{
		set:"app/clipboard/set",
		unset:"app/clipboard/unset",
	},
	dragAndDrop:{
		from:{
			set:"app/dragAndDrop/from/set",
		},
		to:{
			set:"app/dragAndDrop/to/set",
		},
	},
} ;

//actionCreators
export function openAppDialog(content:React.ReactNode) {
    return {
        type:actionTypes.dialog.show,
        payload:content,
    } ;
}
export function hideAppDialog() {
    return {
        type:actionTypes.dialog.hide,
        payload:undefined,
    } ;
} ;
export function setOnCloseAppDialog(onClose:()=>void) {
    return {
        type:actionTypes.dialog.setOnClose,
        payload:onClose,
    } ;
} ;
export function openAppSnackbar(content:React.ReactNode) {
    return {
        type:actionTypes.snackbar.show,
        payload:content,
    } ;
}
export function hideAppSnackbar(){
    return {
        type:actionTypes.snackbar.hide,
        payload:undefined,
    } ;
}
export function setOnCloseAppSnackbar(onClose:()=>void) {
    return {
        type:actionTypes.snackbar.setOnClose,
        payload:onClose,
    } ;
} ;
export function setIsLoading(isLoading:boolean){
    return {
        type :actionTypes.isLoading.set,
        payload:isLoading,
    } ;
}

export function setZoom(value: number) {
    return {
      type: actionTypes.zoom.set,
      payload: value,
    };
  }
  export function incZoom(value: number) {
    return {
      type: actionTypes.zoom.inc,
      payload: value,
    };
  }
  export function setClipboard(ids:string[]){
    return {
      type: actionTypes.clipboard.set,
      payload:ids,
    } ;
  }
  export function unsetClipboard(){
    return {
      type: actionTypes.clipboard.set,
      payload:"none",
    } ;
  }
  export function setDragAndDropFrom(itemId:string){
    return {
      type: actionTypes.dragAndDrop.from.set,
      payload: itemId,
    } ;
  }
  export function setDragAndDropTo(itemId:string){
    return {
      type: actionTypes.dragAndDrop.to.set,
      payload: itemId,
    } ;
}

export function setRuntime(runtime :Runtime | null){
    return {
        type:actionTypes.runtime.set,
        payload:runtime,
    } ;
}
export function setExecutingId(id :string){
    return {
        type:actionTypes.executingId.set,
        payload: id,
    } ;
}

export function setMode(newMode :string){
    return {
        type:actionTypes.mode.set,
        payload:newMode,
    } ;
}

export function selectItemById(id :string) {
    return {
        type:actionTypes.selectItem.select ,
        payload:id ,
    } ;
}
export function unselectItemById(id :string) {
    return {
        type:actionTypes.selectItem.unselect ,
        payload:id ,
    } ;
}
export function toggleMulti(value :boolean) {
    return {
        type:actionTypes.selectItem.toggleMulti ,
        payload:value ,
    } ;
}












