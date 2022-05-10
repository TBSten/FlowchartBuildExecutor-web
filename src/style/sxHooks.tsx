import { Theme } from "@mui/material";

type Palette = Theme["palette"];
/**
 * 
 * @param picker 
 * @example
 * ```tsx
 * <Box sx={getColor(p=>p.error.main)}
 * ```
 */
export function sxColor(picker: (palette: Palette) => (string)) {
    return (theme: Theme) => {
        const ans = { color: picker(theme.palette) }
        return ans;
    };
}
