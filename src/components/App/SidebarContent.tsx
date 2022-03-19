import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { useSp } from "src/style/media";

interface SidebarContentProps {
    title?: string;
}
const SidebarContent: FC<SidebarContentProps> = ({ children, title }) => {
    const isSp = useSp();
    return (
        <Box
            py={isSp ? 0.5 : 1} px={isSp ? 0 : 0.5}
            width="100%"
            overflow="auto"
        >
            {title ?
                <Typography color="text.secondary">{title}</Typography>
                : null
            }
            {children}
        </Box>
    );
}

export default SidebarContent;
