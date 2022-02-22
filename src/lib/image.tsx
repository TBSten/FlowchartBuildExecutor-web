
import { toPng } from "html-to-image";
import { notImplementError } from "./notImplement";


export async function donwloadImage(title: string) {
    const el = document.getElementById("fbe-build-pane");
    if (!el) throw notImplementError();

    const before = {
        transform: el.style.transform
    };
    el.style.transform = "";

    const imageUrl = await toPng(el);
    const aEle = document.createElement("a");
    aEle.href = imageUrl;
    aEle.download = title;
    aEle.click();
    aEle.remove();

    el.style.transform = before.transform;
}


