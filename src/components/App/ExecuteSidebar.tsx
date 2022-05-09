import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getRuntime, getRuntimeKeys } from "src/execute/runtime";
import { getRuntimeNameFromBrowser, saveRuntimeNameToBrowser } from "src/format/browser";
import { logger } from "src/lib/logger";
import { setRuntime } from "src/redux/app/actions";
import { useRuntime } from "src/redux/app/hooks";
import { getAllItems } from "src/redux/items/selectors";
import { useTopFlows } from "src/redux/meta/hooks";
import { useAppSelector } from "src/redux/root/hooks";
import { useSp } from "src/style/media";
import SidebarContent from "./SidebarContent";
import VariableDialog from "./VariableDialog";

const runtimeNames = getRuntimeKeys();


export interface ExecuteSidebarProps { }

const ExecuteSidebar: FC<ExecuteSidebarProps> = () => {

    const dialogOpen = useAppSelector(
        state => state.app.runtime?.dialog.open
    );
    const dialogContent = useAppSelector(
        state => state.app.runtime?.dialog.content
    );
    const runtime = useAppSelector(state => state.app.runtime);
    const RuntimeContent = runtime?.getViewComponent;
    return (
        <Box>
            <SelectRuntime />

            <ExeButtons />

            <Divider />

            <SpeedChange />

            <Divider />

            {RuntimeContent ?
                <RuntimeContent />
                : ""
            }

            {/* <DelayChange /> */}

            <Dialog
                open={Boolean(dialogOpen)}
                onClose={() => runtime?.closeDialog()}
            >
                {dialogContent}
            </Dialog>
        </Box>
    );
};
export default ExecuteSidebar;

const SelectRuntime: FC<{}> = () => {
    const dispatch = useDispatch();
    const items = useAppSelector(getAllItems());
    const [flowIds] = useTopFlows();
    const [selectedName, setSelectedName] = useState(runtimeNames[0]);
    const handleChangeRuntime = (e: SelectChangeEvent) => {
        const name = e.target.value;
        const runtime = getRuntime(name);
        if (!runtime) return;
        runtime.initialize(items, flowIds);
        dispatch(setRuntime({ runtime }));
        setSelectedName(name);
        saveRuntimeNameToBrowser(name);
    };
    useEffect(() => {
        const name = getRuntimeNameFromBrowser();
        if (name) setSelectedName(name);
    }, [])
    useEffect(() => {
        const runtime = getRuntime(selectedName);
        if (runtime) {
            runtime.initialize(items, flowIds);
            dispatch(setRuntime({ runtime }));
        } else {
            logger.error(`unknown runtime name : ${selectedName}`)
        }
        return () => {
            runtime?.stop();
            dispatch(setRuntime({ runtime: null }))
        }
    }, [selectedName, items, flowIds])
    return (
        <SidebarContent title="実行タイプ">
            <Select
                value={selectedName}
                onChange={handleChangeRuntime}
            >
                {runtimeNames.map((name, idx) => (
                    <MenuItem key={name} value={name}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </SidebarContent>
    );
};

const ExeButtons: FC<{}> = () => {
    const {
        runtime,
        initialize,
        executeNext,
        executeAll,
        canExecuteAll,
        stop,
        canStop,
    } = useRuntime();
    useAppSelector(state => state.app.runtime?.status);
    const [openVariableDialog, setOpenVariableDialog] = useState(false);

    if (!runtime) return <div>Please select runtime</div>;
    const handleOpenVariableDialog = () => setOpenVariableDialog(true);
    const handleCloseVariableDialog = () => setOpenVariableDialog(false);
    return (
        <>
            <ExeButtonGroup>
                <Button
                    variant={"contained"}
                    onClick={executeNext}
                    disabled={runtime.isFinished()}
                    startIcon={<PlayArrowIcon />}
                    sx={{ minWidth: "max-content" }}
                >
                    実行
                </Button>
                <Button
                    onClick={executeAll}
                    disabled={!canExecuteAll}
                    startIcon={<PlayArrowIcon />}
                    variant="outlined"
                    sx={{ minWidth: "max-content" }}
                >
                    すべて実行
                </Button>
                <Button
                    disabled={runtime.isFinished()}
                    onClick={stop}
                    startIcon={<StopIcon />}
                    variant="outlined"
                    sx={{ minWidth: "max-content" }}
                >
                    中止
                </Button>
                <Button
                    disabled={!runtime.isFinished()}
                    onClick={initialize}
                    variant="outlined"
                    sx={{ minWidth: "max-content" }}
                >
                    はじめから
                </Button>
            </ExeButtonGroup>
            <ExeButtonGroup>
                <Button onClick={handleOpenVariableDialog}>変数を確認</Button>
            </ExeButtonGroup>

            <VariableDialog open={openVariableDialog} onOpen={handleOpenVariableDialog} onClose={handleCloseVariableDialog} />
        </>
    );
};

const ExeButtonGroup: FC<{}> = ({ children }) => {
    const isSp = useSp();
    return (
        <SidebarContent>
            {isSp ?
                <Box
                    sx={{
                        display: "grid",
                        gap: "10px",
                        gridTemplateRows: "auto",
                        gridAutoFlow: "column",
                    }}
                    p={1}
                >
                    {children}
                </Box>
                :
                <ButtonGroup
                    orientation="horizontal"
                    sx={{ py: 1 }}
                >
                    {children}
                </ButtonGroup>
            }
        </SidebarContent>
    );
};

const marks = [
    {
        value: 0,
        label: "遅",
    },
    {
        value: 10,
        label: "速",
    },
];
const SpeedChange: FC<{}> = () => {
    useAppSelector(state => state.app.runtime?.speed);
    const runtime = useAppSelector(state => state.app.runtime);
    const isSp = useSp();
    const handleChange = (event: unknown, value: number | number[]) => {
        if (runtime) {
            runtime.speed = value as number;
            runtime?.flush();
        }
    };
    if (!runtime) return <>{""}</>;
    return (
        <SidebarContent title="実行速度">
            <Box px={isSp ? 3 : 1.25}>
                <Slider
                    value={runtime.speed}
                    min={0}
                    step={1 / 4}
                    max={10}
                    marks={marks}
                    onChange={handleChange}
                />
            </Box>
            <Stack direction="row" spacing={1} p={1} sx={{ width: "100%", overflow: "auto" }}>
                <Chip label="とても速い" onClick={() => handleChange(null, 9.5)} />
                <Chip label="速い" onClick={() => handleChange(null, 7.5)} />
                <Chip label="普通" onClick={() => handleChange(null, 6.0)} />
                <Chip label="ゆっくり" onClick={() => handleChange(null, 3.0)} />
                <Chip label="とてもゆっくり" onClick={() => handleChange(null, 0)} />
            </Stack>
        </SidebarContent>
    );
};

