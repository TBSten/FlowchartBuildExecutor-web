import Dialog from "@material-ui/core/Dialog" ;
import {useAppDialog} from "redux/app/hooks" ;

export default function AppDialog(){
    const dialog = useAppDialog() ;
    // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    // console.log(dialog);
    // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    function handleClose(){
        console.log("handle close",dialog.onClose);
        dialog.hide();
        dialog.onClose();
        // dialog.onClose();
    }
    return (
        <Dialog open={dialog.open} onClose={handleClose}>
            {dialog.content}
        </Dialog>
        // <div>TEST</div>
    ) ;
}

