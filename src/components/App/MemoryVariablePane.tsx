
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "src/redux/store";
import { useSp } from "src/style/media";
import NoneVariable from "./NoneVariablePane";
import { VariableValue } from "src/execute/eval";
import { notImplement } from "src/lib/notImplement";
import { Tooltip } from "@mui/material";


const MemoryVariablePane: FC<{
    scale: number,
}> = ({ scale }) => {
    const variables = useSelector(
        (state: StoreState) => state.app.runtime?.variables
    );
    const isSp = useSp();
    if (!variables) return <>ERROR !</>;
    if (variables.length <= 0) return <NoneVariable />;
    return (
        <Stack
            spacing={2}
            direction="row"
            flexWrap="wrap"
            sx={{
                width: "fit-content",
                height: "fit-content",
                transform: `scale(${scale})`,
                transformOrigin: "left top",
                backgroundColor: "#dbdbdb",
            }}
            p={isSp ? 0.5 : 2}
        >
            {variables.map((variable) => (
                <Box>
                    <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                        {variable.name}
                    </Typography>
                    <Card variant="outlined" key={variable.name} sx={{ width: "min-content" }}>
                        <Typography variant="h5" p={isSp ? 1 : 3}>
                            {variableValueToNode(variable.name, variable.value)}
                        </Typography>
                    </Card>
                </Box>
            ))}
        </Stack>
    );
};

export default MemoryVariablePane;

function variableValueToNode(name: string, value: VariableValue) {
    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) { return `${value}` }
    if (value instanceof Array) {
        const row = value[0];
        if (row instanceof Array) {
            return array2d(name, value as Array<Array<any>>)
        } else {
            return array1d(name, value as Array<any>)
        }
    }
    notImplement();
}

const style: React.CSSProperties = {
    border: "solid 1px black",
    userSelect: "none",
};
function array1d<T = any>(name: string, array: Array<T>) {
    return <Stack direction="row" sx={style}>
        {
            array.map((value, idx) =>
                <Tooltip title={`${name}[${idx}]`} arrow>
                    <Box p={1} sx={style}>
                        {value}
                    </Box>
                </Tooltip>
            )
        }
    </Stack>
}
function array2d<T = any>(name: string, array: Array<Array<T>>) {
    return <Stack direction="row" sx={style}>
        {
            array.map((row, rowIdx) => (
                <Stack direction="column">
                    {
                        row.map((value, colIdx) => (
                            <Tooltip title={`${name}[${rowIdx}][${colIdx}]`} arrow followCursor>
                                <Box p={1} sx={style}>
                                    {value}
                                </Box>
                            </Tooltip>
                        ))
                    }
                </Stack>
            ))
        }
    </Stack >
}
