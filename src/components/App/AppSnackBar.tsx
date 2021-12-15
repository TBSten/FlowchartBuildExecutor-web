import Snackbar from "@material-ui/core/Snackbar";
import { useAppSnackbar } from "redux/reducers/app";


export default function AppSnackbar(){
    const snackbar = useAppSnackbar();
    return (
        <Snackbar 
            anchorOrigin={{vertical:"bottom",horizontal:"left"}}
            open={snackbar.open} 
            onClose={snackbar.onClose}
            message={snackbar.content}
            />
    ) ;
}

