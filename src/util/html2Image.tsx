
import * as h2i from 'html-to-image';

export async function test(){
    const ele = document.getElementById("fbe-buildpane")
    if(ele){
        const work = ele.style.transform ;
        ele.style.transform = "" ;
        const dataUrl = await h2i.toPng(ele);
        const aEle = document.createElement("a");
        
        aEle.download = "test.png" ;
        aEle.href = dataUrl ;
        console.log(aEle);
        aEle.click();

        aEle.remove();

        ele.style.transform = work ;
    }else{
        throw new Error("unvalid element") ;
    }
}

export type ToImage = (node:HTMLElement)=>Promise<string> ;
export async function downloadBpByImage(toImage:ToImage, fileName:string){
    const ele = document.getElementById("fbe-buildpane")
    if(ele){
        const work = ele.style.transform ;
        ele.style.transform = "" ;
        const dataUrl = await toImage(ele);
        const aEle = document.createElement("a");
        
        aEle.download = fileName ;
        aEle.href = dataUrl ;
        console.log(aEle);
        aEle.click();

        aEle.remove();

        ele.style.transform = work ;
    }else{
        throw new Error("unvalid element") ;
    }
}
export async function downloadBpByPng(fileName:string){
    await downloadBpByImage(h2i.toPng, fileName);
}
export async function downloadBpByJpeg(fileName:string){
    await downloadBpByImage(h2i.toJpeg, fileName);
}
export async function downloadBpBySvg(fileName:string){
    await downloadBpByImage(h2i.toSvg, fileName);
}
export async function downloadBp(type :"png"|"jpeg"|"svg",fileName:string){
    switch(type){
        case "png":
            await downloadBpByPng(fileName);
            break;
        case "jpeg":
            await downloadBpByJpeg(fileName);
            break;
        case "svg":
            await downloadBpBySvg(fileName);
            break;
        default :
            throw new Error("unvalid download type :"+type) ;
    }
}

