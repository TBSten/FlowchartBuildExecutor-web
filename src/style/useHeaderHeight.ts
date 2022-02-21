import { useTheme , useThemeProps } from "@mui/material/styles";

export function useHeaderHeight(){
    const theme = useTheme() ;
    const height = theme.mixins.toolbar.minHeight ;
    const test = useThemeProps({
        name:"useHeaderHeight",
        props:theme.mixins.toolbar,
    })
    console.log(
        "useHeaderHeight",
        theme.mixins.toolbar,
        test);
    if(height){
        // return parseInt(
        //     height.toString().replace("px","")
        // ) ;
        return theme.mixins.toolbar ;
    }
    return 0 ;
    
}
