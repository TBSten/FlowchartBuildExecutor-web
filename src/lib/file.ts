import { logger } from "./logger";

export function getFileText(){
    return new Promise<string>((resolve,reject)=>{
        const inputEle = document.createElement("input") ;
        inputEle.type = "file" ;
        inputEle.addEventListener("change",()=>{
            const files = inputEle.files ;
            if(files && files[0]){
                const reader = new FileReader() ;
                reader.addEventListener("load",()=>{
                    const text = reader.result ;
                    if(typeof text === "string"){
                        logger.log("getFileText",text)
                        resolve(text);
                    }
                });
                reader.readAsText(files[0])
                return ;
            }
            logger.error("getFileText",files)
            reject();
        });
        inputEle.click();
    }) ;
}
export async function downloadTextFile(text :string,title :string){
    const aEle = document.createElement("a") ;
    aEle.href = window.URL.createObjectURL(new Blob([text],{"type":"text/plain"})) ;
    aEle.download = title ;
    aEle.click();
    aEle.remove();
    logger.log("downloadTextFile",text,title)
    return ;
}

