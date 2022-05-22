import { FC, useEffect } from "react";
import BuildPane from "./components/App/BuildPane";
import { getFromServer } from "./format/share";
import { loadJson } from "./format/util";
import { useMode, useZoom } from "./redux/app/hooks";

interface PreviewProps {
}
const Preview: FC<PreviewProps> = () => {
    const [zoom, setZoom] = useZoom()
    const [mode, setMode] = useMode()
    useEffect(() => {
        (async () => {
            setZoom(1)
            setMode("export")
            const params = new URLSearchParams(window.location.search);
            if (!params.has("shareId")) {
                alert("none shareId !")
                return;
            }
            const fbe = await getFromServer(params.get("shareId") as string);
            loadJson(fbe);
        })()
    }, [])

    return (
        <BuildPane disablePadding />
    );
}

export default Preview;

