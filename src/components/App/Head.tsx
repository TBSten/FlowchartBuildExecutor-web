
import {
    AppBar, 
    Toolbar,
    Typography,
    IconButton,
} from "@material-ui/core";
import {
    Menu as MenuIcon,
} from "@material-ui/icons";


export default function Head(props :object){
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
