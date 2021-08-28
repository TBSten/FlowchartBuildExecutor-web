
import {
    AppBar, 
    Toolbar,
    Typography,
    IconButton,
} from "@material-ui/core";
import {
    Menu as MenuIcon,
} from "@material-ui/icons";
import { useEditItems } from "atom/syms";


export default function Head(props :object){
    const { addItem,addSymToFlow } = useEditItems();
    return (
        <AppBar position="static" {...props}>
            <Toolbar>
                <IconButton edge="start" color="inherit">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6">
                    FBE
                </Typography>
            </Toolbar>
        </AppBar>
    ) ;
}
