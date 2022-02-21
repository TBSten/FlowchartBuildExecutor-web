import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import { ChangeEventHandler, FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "src/redux/store";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { setRuntime } from "src/redux/app/actions";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { getAllItems } from "src/redux/items/selectors";
import { getFlowIds } from "src/redux/meta/selectors";
import { useSp } from "src/style/media";
import { getRuntime, getRuntimeKeys, getRuntimeFactories } from "src/execute/runtime";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Slider from "@mui/material/Slider";
import { useDialog } from "src/lib/useDialog";
import VariablePane from "./VariablePane";
import Stack from "@mui/material/Stack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { TextField } from "@mui/material";
import { mustNumber } from "src/lib/typechecker";

const runtimeFactories = getRuntimeFactories();
const runtimeNames = getRuntimeKeys();


export interface ExecuteSidebarProps { }

const ExecuteSidebar: FC<ExecuteSidebarProps> = () => {

    const dialogOpen = useSelector(
        (state: StoreState) => state.app.runtime?.dialog.open
    );
    const dialogContent = useSelector(
        (state: StoreState) => state.app.runtime?.dialog.content
    );
    const runtime = useSelector((state: StoreState) => state.app.runtime);
    return (
        <Box>
            <SelectRuntime />

            <ExeButtons />

            <Divider />

            <SpeedChange />

            <Divider />

            <DelayChange />

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
    const items = useSelector(getAllItems());
    const flowIds = useSelector(getFlowIds());
    const [selectedName, setSelectedName] = useState(runtimeNames[0]);
    const handleChangeRuntime = (e: SelectChangeEvent) => {
        const name = e.target.value;
        const runtime = getRuntime(name);
        if (!runtime) return;
        runtime.initialize(items, flowIds);
        dispatch(setRuntime({ runtime }));
        setSelectedName(name);
    };
    useEffect(() => {
        const runtime = getRuntime();
        runtime.initialize(items, flowIds);
        dispatch(setRuntime({ runtime }));
        return () => {
            dispatch(setRuntime({ runtime: null }));
        };
    }, [items, flowIds, dispatch]);
    return (
        <Box>
            <Typography>
                実行タイプ
            </Typography>
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
        </Box>
    );
};

const ExeButtons: FC<{}> = () => {
    const runtime = useSelector((state: StoreState) => state.app.runtime);
    const items = useSelector(getAllItems());
    const topFlowIds = useSelector(getFlowIds());
    useSelector((state: StoreState) => state.app.runtime?.status);
    const [
        TraceDialog,
        traceDialogProps,
        { open: openTraceDialog, close: closeTraceDialog },
    ] = useDialog();

    if (!runtime) return <div>Please select runtime</div>;
    const handleInit = () => {
        runtime.initialize(items, topFlowIds);
        runtime.flush();
    };
    const handleExe = () => {
        runtime.executeNext();
        runtime.flush();
    };
    const handleExeAll = () => {
        runtime.executeAll();
        runtime.flush();
    };
    const handleStop = () => {
        runtime.stop();
        runtime.flush();
    };
    return (
        <>
            {/* <ExeButtonGroup>
                <Button variant={"contained"} onClick={handleInit}>
                    初期化
                </Button>
            </ExeButtonGroup> */}
            <ExeButtonGroup>
                <Button
                    variant={"contained"}
                    onClick={handleExe}
                    disabled={runtime.isFinished()}
                    startIcon={<PlayArrowIcon />}
                >
                    実行
                </Button>
                <Button
                    onClick={handleExeAll}
                    disabled={runtime.status !== "BEFORE_START"}
                    startIcon={<PlayArrowIcon />}
                >
                    すべて実行
                </Button>
                <Button
                    disabled={runtime.isFinished()}
                    onClick={handleStop}
                    startIcon={<StopIcon />}
                >
                    中止
                </Button>
                <Button disabled={!runtime.isFinished()} onClick={handleInit}>
                    はじめから
                </Button>
            </ExeButtonGroup>
            <ExeButtonGroup>
                <Button onClick={openTraceDialog}>変数を確認</Button>
            </ExeButtonGroup>

            <TraceDialog {...traceDialogProps}>
                <VariablePane />
                <Stack direction="row" justifyContent="flex-end">
                    <Button onClick={closeTraceDialog}>閉じる</Button>
                </Stack>
            </TraceDialog>
        </>
    );
};

const ExeButtonGroup: FC<{}> = ({ children }) => {
    const isSp = useSp();
    return (
        <Box>
            <ButtonGroup
                orientation={isSp ? "vertical" : "horizontal"}
                sx={{ py: 1 }}
            >
                {children}
            </ButtonGroup>
        </Box>
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
    useSelector((state: StoreState) => state.app.runtime?.speed);
    const runtime = useSelector((state: StoreState) => state.app.runtime);
    const handleChange = (event: unknown, value: number | number[]) => {
        if (runtime) {
            runtime.speed = value as number;
            runtime?.flush();
        }
    };
    if (!runtime) return <>{""}</>;
    return (
        <Box sx={{ px: 2, py: 1 }}>
            <Typography>
                実行速度
            </Typography>
            <Box>
                <Slider
                    value={runtime.speed}
                    min={0}
                    step={0.125}
                    max={10}
                    marks={marks}
                    onChange={handleChange}
                />
            </Box>
            <Stack direction="row" spacing={1} p={1} sx={{ width: "100%", overflow: "auto" }}>
                <Chip label="とても速い" onClick={() => handleChange(null, 9)} />
                <Chip label="速い" onClick={() => handleChange(null, 7)} />
                <Chip label="遅い" onClick={() => handleChange(null, 3)} />
                <Chip label="とても遅い" onClick={() => handleChange(null, 0)} />
            </Stack>
        </Box>
    );
};
const DelayChange: FC<{}> = () => {
    const runtime = useSelector((state: StoreState) => state.app.runtime);
    useSelector((state: StoreState) => state.app.runtime?.delay)
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        let time = parseInt(e.target.value);
        if (!runtime) return;
        if (!time) time = 0;
        runtime.delay = mustNumber(time);
        runtime.flush();
    };
    console.log(runtime?.delay)
    return (
        <Box sx={{ px: 2, py: 1 }}>
            <Typography>
                すべて実行をクリックしてから
            </Typography>
            <Box sx={{ verticalAlign: "middle" }}>
                <TextField
                    type="number"
                    value={runtime?.delay}
                    onChange={handleChange}
                    sx={{ width: "5em" }}
                />
                秒後に実行し始める
            </Box>
        </Box>
    )
};


