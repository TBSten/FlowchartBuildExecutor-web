import { Box, Stack } from "@mui/material";
import { FC } from "react";
import ErrorView from "src/components/util/ErrorView";
import { useOption } from "src/redux/items/hooks";
import { isOption } from "src/redux/items/types";
import { OptionComponent, OptionEditorProps } from "../option";


const CalcOptionEditor: FC<OptionEditorProps> = ({ symId }) => {
    const [formula, setFormula] = useOption(symId, "式");
    const [variable, setVariable] = useOption(symId, "代入先変数");
    if (!isOption(formula) || !isOption(variable)) return <ErrorView>invalid option</ErrorView>
    return (
        <Box>
            <Stack direction="row" flexWrap="wrap" alignItems="center">
                <OptionComponent option={formula} setOption={setFormula} />
                の計算結果を
            </Stack>
            <Stack direction="row" flexWrap="wrap" alignItems="center">
                <OptionComponent option={variable} setOption={setVariable} />
                へ代入する
            </Stack>
        </Box>
    );
}

export default CalcOptionEditor;
