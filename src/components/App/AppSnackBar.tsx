import IconButton from "@material-ui/core/IconButton";
import Cancel from "@material-ui/icons/Cancel" ;
import Snackbar, { SnackbarProps } from "@material-ui/core/Snackbar";
import { useAppSnackbar } from "redux/app/hooks";

export default function AppSnackbar(){
    const snackbar = useAppSnackbar();

    const handleCloseClick = ()=>{
        snackbar.onClose();
    } ;

    const snackbarProps:SnackbarProps = {
        anchorOrigin:{vertical:"bottom",horizontal:"left"},
        open:snackbar.open ,
        onClose:snackbar.onClose,
        message:snackbar.content,
        action:(
            <IconButton onClick={handleCloseClick} color="inherit">
                <Cancel />
            </IconButton>
        ),
    } ;

    return (
        // <Snackbar {...snackbarProps}/>
        <></>
    ) ;
}

