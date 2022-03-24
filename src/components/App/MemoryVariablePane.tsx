
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { FC } from "react";
import { VariableValue } from "src/execute/eval";
import { notImplement } from "src/lib/error";
import { useAppSelector } from "src/redux/root/hooks";
import { useSp } from "src/style/media";
import NoneVariable from "./NoneVariablePane";


const MemoryVariablePane: FC<{
    scale: number,
}> = ({ scale }) => {
    const variables = useAppSelector(
        state => state.app.runtime?.variables
    );
    const isSp = useSp();
    if (!variables) return <>ERROR !</>;
    if (variables.length <= 0) return <NoneVariable />;
    return (
        <Box
            sx={{
                backgroundColor: "#dbdbdb",
            }}
        >
            <Stack
                spacing={2}
                direction="row"
                flexWrap="wrap"
                sx={{
                    width: "fit-content",
                    minWidth: "max(100%,90vw)",
                    height: "fit-content",
                    backgroundColor: "#dbdbdb",
                    transform: `scale(${scale})`,
                    transformOrigin: "left top",
                }}
                p={isSp ? 1.5 : 2}
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
        </Box>
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
