import { Box, CircularProgress } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { sleep } from "src/lib/sleep";
import { clearBrowserData } from "./format/browser";

interface ResetProps {
}
const Reset: FC<ResetProps> = () => {
    const [isFinished, setIsFinished] = useState(false);
    useEffect(() => {
        Promise.all([
            clearBrowserData(),
            sleep(3000),
        ]).then(() => {
            setIsFinished(true);
        });
    }, [])
    if (isFinished) {
        return <Navigate to="/" />
    }
    return <Clearing />
}

export default Reset;



const Clearing: FC<{}> = () => {
    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
        }}>
            <h1>しばらくそのままでお待ちください</h1>
            <CircularProgress size={50} />
        </Box>
    )
}

