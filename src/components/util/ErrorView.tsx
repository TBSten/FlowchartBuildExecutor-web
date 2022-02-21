import Box from "@mui/material/Box";
import { FC } from "react";
import { logger } from "src/lib/logger";


export interface ErrorViewProps {
    log?: any[];
}
const ErrorView: FC<ErrorViewProps> = ({ children, log = [] }) => {
    logger.error(...log)
    return <Box sx={{ color: "red" }}>
        # ERROR !
        {children}
    </Box>
};

export default ErrorView;


