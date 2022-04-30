import { Box } from "@mui/material";
import { FC } from "react";
import ErrorView from "src/components/util/ErrorView";
import { useOption } from "src/redux/items/hooks";
import { isOption } from "src/redux/items/types";
import { OptionComponent, OptionEditorProps } from "../option";


const OutputOptionEditor: FC<OptionEditorProps> = ({ symId }) => {
    const [target, setTarget] = useOption(symId, "表示対象");
    if (!isOption(target)) return <ErrorView>invalid option</ErrorView>
    return (
        <Box>
            <OptionComponent option={target} setOption={setTarget} />
            を表示する
        </Box>
    );
}

export default OutputOptionEditor;
