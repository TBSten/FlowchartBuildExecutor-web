import { Box, BoxProps } from "@mui/material";
import { FC, useEffect } from "react";
import { useAppSelector } from "src/redux/root/hooks";

type EmphansibleProps = BoxProps & {
    target: string,
}
const Emphansible: FC<EmphansibleProps> = ({ target, children, ...other }) => {
    const isEmphansis = useAppSelector((state) => {
        return state.app.emphasisTarget === target;
    })
    useEffect(() => {
        if (isEmphansis) {
            window.location.hash = `sidebar-${target}`
        }
    }, [isEmphansis])
    return (
        <Box
            border="solid 2px"
            borderRadius="5px"
            borderColor={theme =>
                isEmphansis ?
                    theme.palette.primary.main :
                    "rgb(0 0 0 / 0%)"}
            {...other}
        >
            {children}
        </Box>
    );
}

export default Emphansible;
