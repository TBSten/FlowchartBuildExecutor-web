import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AppsIcon from "@mui/icons-material/Apps";
import TocIcon from "@mui/icons-material/Toc";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "src/redux/store";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import { useSp } from "src/style/media";
import MemoryVariablePane from "./MemoryVariablePane";
import TableVariablePane from "./TableVariablePane";

export interface VariablePaneProps {}

type Mode = "memory" | "table";

const VariablePane: FC<VariablePaneProps> = () => {
    const runtime = useSelector((state: StoreState) => state.app.runtime);
    const [mode, setMode] = useState<Mode>("memory");

    if (!runtime) return <>実行タイプを選択してください</>;
    return (
        <Box>
            <Box sx={{position:"sticky",top:0,left:0,backgroundColor:"white",zIndex:10}}>
                <ModeSelect mode={mode} onChange={(mode) => setMode(mode)} />
            </Box>

            <Box sx={{ maxHeight: "75vh", overflow: "auto" }}>
                {mode === "memory" ? (
                    <MemoryVariablePane />
                ) : mode === "table" ? (
                    <TableVariablePane />
                ) : (
                    ""
                )}
            </Box>

        </Box>
    );
};
export default VariablePane;

interface PaneProps {}

// const TablePane: FC<{}> = () => {
//     const history = useSelector(
//         (state: StoreState) => state.app.runtime?.variableHistory
//     );
//     if (!history) return <>ERROR !</>;
//     if (history.length <= 0) return <NoneVariable />;
//     const headerSet = history.reduce((set, variables) => {
//         variables.forEach((variable) => {
//             set.add(variable.name);
//         });
//         return set;
//     }, new Set<string>());
//     const headers = Array.from(headerSet.values());
//     return (
//         // <TableContainer>
//             <Table stickyHeader size="small" sx={{minWidth:"70vw"}}>
//                 <TableHead>
//                     <TableRow>
//                         {headers.map((header) => (
//                             <TableCell align="center">{header}</TableCell>
//                         ))}
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {history.map((variables) => (
//                         <TableRow >
//                             {variables.map((variable) => (
//                                 <TableCell align="center" key={variable.name}>
//                                     {variable.value}
//                                 </TableCell>
//                             ))}
//                             {Array(headers.length-variables.length).fill(1).map(()=>(
//                                 <TableCell align="center">
//                                     -
//                                 </TableCell>
//                             ))}

//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         // </TableContainer>
//     );
// };
// const MemoryPane: FC<PaneProps> = () => {
//     const variables = useSelector(
//         (state: StoreState) => state.app.runtime?.variables
//     );
//     const isSp = useSp() ;
//     if (!variables) return <>ERROR !</>;
//     if (variables.length <= 0) return <NoneVariable />;
//     return (
//         <Box sx={{width:"100%"}}>
//             <Stack
//                 spacing={2}
//                 direction="row"
//                 flexWrap="wrap"
//                 sx={{
//                     backgroundColor: "#dbdbdb",
//                 }}
//                 p={isSp?0.5:2}

//             >
//                 {variables.map((variable) => (
//                     <Box>
//                         <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
//                             {variable.name}
//                         </Typography>
//                         <Card variant="outlined" key={variable.name} sx={{width:"min-content"}}>
//                             <Typography variant="h5" p={isSp?1:3}>
//                                 {variable.value}
//                             </Typography>
//                         </Card>
//                     </Box>
//                 ))}
//             </Stack>
//         </Box>
//     );
// };
// const NoneVariable: FC<{}> = () => {
//     return <>変数がありません</>;
// };
interface ModeSelectProps {
    mode: Mode;
    onChange: (mode: Mode) => any;
}
const ModeSelect: FC<ModeSelectProps> = ({ mode, onChange }) => {
    const handleSelect = (mode: Mode) => () => onChange(mode);
    return (
        <Box>
            <IconButton
                color={mode === "memory" ? "primary" : "default"}
                onClick={handleSelect("memory")}
            >
                <AppsIcon />
            </IconButton>
            <IconButton
                color={mode === "table" ? "primary" : "default"}
                onClick={handleSelect("table")}
            >
                <TocIcon />
            </IconButton>
        </Box>
    );
};
