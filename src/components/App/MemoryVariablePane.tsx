
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { FC } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "src/redux/store";
import { useSp } from "src/style/media";
import NoneVariable from "./NoneVariablePane";
import { VariableValue } from "src/execute/eval";
import { notImplement } from "src/lib/notImplement";


const MemoryVariablePane: FC<{}> = () => {
    const variables = useSelector(
        (state: StoreState) => state.app.runtime?.variables
    );
    const isSp = useSp() ;
    if (!variables) return <>ERROR !</>;
    if (variables.length <= 0) return <NoneVariable />;
    return (
        <Box sx={{width:"100%"}}>
            <Stack
                spacing={2}
                direction="row"
                flexWrap="wrap"
                sx={{
                    backgroundColor: "#dbdbdb",
                }}
                p={isSp?0.5:2}
            >
                {variables.map((variable) => (
                    <Box>
                        <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                            {variable.name}
                        </Typography>
                        <Card variant="outlined" key={variable.name} sx={{width:"min-content"}}>
                            <Typography variant="h5" p={isSp?1:3}>
                                {variableValueToNode(variable.value)}
                            </Typography>
                        </Card>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default MemoryVariablePane ;

function variableValueToNode(value:VariableValue){
    if(
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ){ return `${value}` }
    if( value instanceof Array){
        if(!(value[0] instanceof Array)){
            return (
                <Box sx={{px:2,py:1}}>
                    {value.map(v=>(
                        <Box key={`${v}`}>

                        </Box>
                    ))}
                </Box>
            ) ;
        }
    }
    notImplement();
}
