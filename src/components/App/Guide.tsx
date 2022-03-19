import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { FC } from "react";
import { getGuideContent } from "src/redux/app/selectors";
import { useAppSelector } from "src/redux/root/operations";


export interface GuideProps { }

const Guide: FC<GuideProps> = () => {
    const guideContent = useAppSelector(getGuideContent());
    return (
        <Box>
            {guideContent ?? "表示する内容がありません"}
            <Hr />
        </Box>
    );
};
export default Guide;

const Hr = () => (
    <Box sx={{ p: 1 }}>
        <Divider />
    </Box>
);

