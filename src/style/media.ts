
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


export function useSp() {
    const theme = useTheme();
    const matches = !useMediaQuery(theme.breakpoints.up("sm"));
    return matches;
}
export function usePc() {
    const isSp = useSp();
    return !isSp;
}

type CssProperty = string | number;
/**
 * ### usage
 * <Box sx={{
 *     width:responsiveStyleValue("100%","1000px"),
 * }}>
 *     ...
 * </Box>
 */
export function responsiveStyleValue(
    pc: CssProperty,
    mobile: CssProperty
) {
    return {
        xs: mobile,
        sm: pc,
    };
}

export const rsv = responsiveStyleValue;

