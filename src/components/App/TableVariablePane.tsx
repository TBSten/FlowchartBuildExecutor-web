import { Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FC, ReactNode } from "react";
import { VariableValue } from "src/execute/eval";
import { notImplementError } from "src/lib/error";
import { isBoolean, isBooleanArray, isBooleanArray2D, isNumber, isNumberArray, isNumberArray2D, isString, isStringArray, isStringArray2D } from "src/lib/typechecker";
import { useAppSelector } from "src/redux/root/hooks";
import NoneVariable from "./NoneVariablePane";

const TableVariablePane: FC<{
    scale: number,
}> = () => {
    const history = useAppSelector(
        state => state.app.runtime?.variableHistory
    );
    if (!history) return <>ERROR !</>;
    if (history.length <= 0) return <NoneVariable />;
    const headerSet = history.reduce((set, variables) => {
        variables.forEach((variable) => {
            set.add(variable.name);
        });
        return set;
    }, new Set<string>());
    const headers = Array.from(headerSet.values());
    return (
        <Table stickyHeader size="small" sx={{ minWidth: "70vw" }}>
            <TableHead>
                <TableRow>
                    {headers.map((header) => (
                        <TableCell align="center" key={header}>
                            {header}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {history.map((variables, i) => (
                    <TableRow key={i}>
                        {variables.map((variable) => (
                            <TableCell
                                align="center"
                                key={variable.name}
                                sx={{
                                    ...(variable.name === variables.changedName
                                        ? {
                                            color: "primary.main",
                                            fontWeight: "bold"
                                        }
                                        : {}),
                                    wordBreak: "keep-all",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {valueToView(variable.value)}
                            </TableCell>
                        ))}
                        {Array(headers.length - variables.length)
                            .fill(1)
                            .map((i) => (
                                <TableCell align="center" key={i}>-</TableCell>
                            ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TableVariablePane;

function valueToView(value: VariableValue, easy: boolean = false): ReactNode {
    if (isString(value) || isNumber(value) || isBoolean(value)) {
        return ` ${value.toString()} `
    } else if (isStringArray2D(value) || isNumberArray2D(value) || isBooleanArray2D(value)) {
        const lines = value.map(v => <Box> {valueToView(v, true)} </Box>)
        return (
            <>
                {!easy && "2次元配列"}
                {lines}
            </>
        )
    } else if (isStringArray(value) || isNumberArray(value) || isBooleanArray(value)) {
        return (
            <>
                {!easy && "配列"}
                [{
                    value.map(v => valueToView(v))
                        .reduce((ans, v) => ans === null ? [v] : [ans, ",", v], null)
                }]
            </>
        )
    }
    throw notImplementError(`unknown value type / value:${value} value's type:${typeof value}`);
}

