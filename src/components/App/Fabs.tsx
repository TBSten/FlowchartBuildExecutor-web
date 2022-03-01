import Edit from "@mui/icons-material/Edit";
import PlayArrow from "@mui/icons-material/PlayArrow";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import React, { FC } from "react";
import { useMode, useZoom } from "src/redux/app/operations";

export interface FabsProps { }

const Fabs: FC<FabsProps> = () => {
    const [mode, setMode] = useMode();
    const [, , incZoom] = useZoom();
    const handleToEditMode = () => {
        setMode("edit");
    };
    const handleToExeMode = () => {
        setMode("execute");
    };
    // const handleZoomIn = () => {
    //     incZoom(+0.05);
    // };
    // const handleZoomOut = () => {
    //     incZoom(-0.05);
    // };
    return (
        <>
            <SpeedDial ariaLabel="" icon={<SpeedDialIcon />} direction="down">
                {mode !== "edit" ? (
                    <SpeedDialAction
                        icon={<Edit />}
                        tooltipTitle="編集する"
                        onClick={handleToEditMode}
                        color=""
                    />
                ) : (
                    ""
                )}
                {mode !== "execute" ? (
                    <SpeedDialAction
                        icon={<PlayArrow />}
                        tooltipTitle="実行する"
                        onClick={handleToExeMode}
                    />
                ) : (
                    ""
                )}

                {/* <SpeedDialAction
                    icon={<ZoomIn />}
                    tooltipTitle="拡大"
                    onClick={handleZoomIn}
                />

                <SpeedDialAction
                    icon={<ZoomOut />}
                    tooltipTitle="縮小"
                    onClick={handleZoomOut}
                /> */}
            </SpeedDial>
        </>
    );
};

export default React.memo(Fabs);
