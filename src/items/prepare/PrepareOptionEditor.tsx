import { Divider, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { FC } from "react";
import ErrorView from "src/components/util/ErrorView";
import { useOption } from "src/redux/items/hooks";
import { OptionComponent, OptionEditorProps } from "../option";

const PrepareOptionEditor: FC<OptionEditorProps> = ({ symId, }) => {
    const [target, setTarget] = useOption(symId, "準備対象")
    const [targetType, setTargetType] = useOption(symId, "種類")
    const [first, setFirst] = useOption(symId, "初期値")
    const [count, setCount] = useOption(symId, "要素数")
    const [isEasy, setIsEasy] = useOption(symId, "簡易表示")
    if (!target || !targetType || !first || !count || !isEasy) return <ErrorView> invalid option </ErrorView>
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
        }}>
            ①初期化設定
            <Stack direction="row" flexWrap="wrap" my={0.5}>
                <Stack direction="row" alignItems="center" mr={1}>
                    <OptionComponent option={targetType} setOption={setTargetType} />
                    の
                </Stack>
                <Stack direction="row" alignItems="center" mr={1}>
                    <OptionComponent option={target} setOption={setTarget} />
                    を
                </Stack>
            </Stack>
            <Stack direction="row" flexWrap="wrap" my={0.5}>
                <Stack direction="row" alignItems="center" mr={1} flexWrap="wrap">
                    要素数
                    <OptionComponent option={count} setOption={setCount} />
                </Stack>
                <Stack direction="row" alignItems="center" mr={1} flexWrap="wrap">
                    初期値
                    <OptionComponent option={first} setOption={setFirst} />
                </Stack>
            </Stack>
            で初期化する
            <Divider flexItem sx={{ my: 2 }} />
            ②表示設定
            <Stack direction="row" alignItems="center">
                <OptionComponent option={isEasy} setOption={setIsEasy} />
                {isEasy.value ? "する" : "しない"}
            </Stack>
        </Box>
    );
}

export default PrepareOptionEditor;

