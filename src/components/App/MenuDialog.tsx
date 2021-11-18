
import Dialog from "@material-ui/core/Dialog" ;
import DialogTitle from "@material-ui/core/DialogTitle" ;
import DialogContent from "@material-ui/core/DialogContent" ;
import DialogActions from "@material-ui/core/DialogActions" ;
import List from "@material-ui/core/List" ;
import ListItem from "@material-ui/core/ListItem" ;

import Button from "components/util/Button" ;
import { SideBarMenu } from "./types";
import { useMode } from "redux/reducers/mode";

export interface MenuDialogProps{
    open:boolean;
    onClose:()=>void;
    menus:(SideBarMenu|"hr")[];
    itemId:string;
}
export default function MenuDialog(props:MenuDialogProps){
    const mode = useMode();
    return (
        <Dialog open={mode==="edit" && props.open} onClose={props.onClose}>
            <DialogTitle>メニュー</DialogTitle>
            <DialogContent>
                <List>
                    {props.menus.length <= 0?
                    "エラー"
                    :
                    props.menus.map((menu) => (
                        menu === "hr" ?
                        <hr/>
                        :
                        <ListItem button onClick={()=>{props.onClose();menu.onClick(props.itemId);}}>
                            {menu.icon}
                            {menu.label}
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined" 
                    color="primary" 
                    onClick={props.onClose}>
                        閉じる
                </Button>
            </DialogActions>
        </Dialog>
    ) ;
}
