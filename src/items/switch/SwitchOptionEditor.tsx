import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { selectItemOne } from "src/redux/app/actions";
import { useItemOperations, useSym } from "src/redux/items/hooks";
import { getItems } from "src/redux/items/selectors";
import { Flow, isFlow } from "src/redux/items/types";
import { useAppSelector } from "src/redux/root/hooks";
import { useSp } from "src/style/media";
import { flowCreator } from "../flow/creator";
import { DefaultOptionEditor, SymOptionEditor } from "../option";
import { makeItemId } from "../util";


const SwitchOptionEditor: SymOptionEditor = (props) => {
    // const [formula, setFormula] = useOption(symId, "式");
    // const [variable, setVariable] = useOption(symId, "代入先変数");
    // if (!isOption(formula) || !isOption(variable)) return <ErrorView>invalid option</ErrorView>
    const { setItem } = useItemOperations();
    const [item] = useSym(props.symId);
    const flows = useAppSelector(state => {
        const flowIds = item.childrenItemIds;
        const items = getItems(...flowIds)(state);
        const flows = items.filter(item => isFlow(item)) as Flow[];
        return flows;
    });
    const addChild = () => {
        const childId = makeItemId(`switch-flow`);
        const child = flowCreator(childId, props.symId);
        child.tag = `${item.childrenItemIds.length + 1}`;
        setItem(child);
        setItem({
            ...item,
            childrenItemIds: [
                ...item.childrenItemIds,
                childId,
            ]
        });
    }
    const isSp = useSp();
    return (
        <>

            <DefaultOptionEditor {...props} />

            <Typography color="text.secondary" mt={5}>
                分岐先
            </Typography>
            <List sx={{ ml: 1 }}>
                {flows.map(flow => (
                    <BranchListItem flow={flow} />
                ))}
                <ListItemButton
                    sx={theme => ({ color: theme.palette.primary.main })}
                    onClick={addChild}
                >
                    {!isSp && "分岐先を"}
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText>
                        追加する
                    </ListItemText>
                </ListItemButton>
            </List>
        </>
    );
}

export default SwitchOptionEditor


interface BranchListItemProps {
    flow: Flow,
}
const BranchListItem: FC<BranchListItemProps> = ({ flow }) => {
    const dispatch = useDispatch();
    const { removeItem } = useItemOperations();
    const selectFlow = () => {
        dispatch(selectItemOne({ itemId: flow.itemId }));
    }
    const deleteFlow = () => {
        removeItem(flow.itemId);
    }
    const isSp = useSp();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const handleOpen = (el: HTMLElement) => setAnchorEl(el);
    const handleClose = () => setAnchorEl(null);
    return (
        <ListItem
            secondaryAction={
                isSp ?
                    <>
                        <IconButton onClick={e => handleOpen(e.currentTarget)}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            open={isOpen}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => {
                                handleClose();
                                deleteFlow();
                            }}>
                                削除
                            </MenuItem>
                        </Menu>
                    </>
                    :
                    <>
                        <IconButton
                            onClick={(e) => {
                                e.preventDefault();
                                deleteFlow();
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                        {/* add icon button here */}
                    </>

            }
            disablePadding
        >
            <ListItemButton
                onClick={() => {
                    selectFlow()
                }}
            >
                {flow.tag}
            </ListItemButton>
        </ListItem>
    );
}

