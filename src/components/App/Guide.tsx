import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { FC } from "react";
import { useSelector } from "react-redux";
import { getGuideContent } from "src/redux/app/selectors";


export interface GuideProps {}

const Guide: FC<GuideProps> = () => {
    const guideContent = useSelector(getGuideContent());
    return (
        <Box>
            {guideContent?? "表示する内容がありません"}
            <Hr/>
        </Box>
    );
};
export default Guide;

const Hr = ()=>(
    <Box sx={{p:1}}>
        <Divider />
    </Box>
) ;

