import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FC } from "react";
import { VariableValue } from "src/execute/eval";
import { notImplementError } from "src/lib/error";
import { isBoolean, isBooleanArray, isBooleanArray2D, isNumber, isNumberArray, isNumberArray2D, isString, isStringArray, isStringArray2D } from "src/lib/typechecker";
import { useAppSelector } from "src/redux/root/operations";
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
        // <TableContainer>
        <Table stickyHeader size="small" sx={{ minWidth: "70vw" }}>
            <TableHead>
                <TableRow>
                    {headers.map((header) => (
                        <TableCell align="center">{header}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {history.map((variables) => (
                    <TableRow>
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
                                }}
                            >
                                {valueToString(variable.value)}
                            </TableCell>
                        ))}
                        {Array(headers.length - variables.length)
                            .fill(1)
                            .map(() => (
                                <TableCell align="center">-</TableCell>
                            ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        // </TableContainer>
    );
};

export default TableVariablePane;

function valueToString(value: VariableValue): string {
    if (isString(value) || isNumber(value) || isBoolean(value)) {
        return ` ${value.toString()} `
    } else if (isStringArray2D(value) || isNumberArray2D(value) || isBooleanArray2D(value)) {
        const lines = value.map(v => ` [${v.map(v => valueToString(v)).join(",")}] `)
        return `2次元配列[${lines.join("\n")}]`;
    } else if (isStringArray(value) || isNumberArray(value) || isBooleanArray(value)) {
        return `配列[${value.map(v => valueToString(v)).join(",")}]`;
    }
    throw notImplementError(`unknown value type / value:${value} value's type:${typeof value}`);
}

