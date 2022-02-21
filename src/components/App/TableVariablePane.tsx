import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { FC } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "src/redux/store";
import NoneVariable from "./NoneVariablePane";

const TableVariablePane: FC<{}> = () => {
    const history = useSelector(
        (state: StoreState) => state.app.runtime?.variableHistory
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
                                              fontWeight:"bold"
                                          }
                                        : {}),
                                }}
                            >
                                {variable.value}
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
