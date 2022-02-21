import React, { ChangeEvent, ChangeEventHandler, FC, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";

import { useSelector } from "react-redux";
import { makeItemId } from "src/items/util";
import { useFlow, useItem, useItemOperations } from "src/redux/items/operations";
import { StoreState } from "src/redux/store";
import { useFlows } from "src/redux/meta/operations";
import { flowCreatorWithChildren } from "src/items/flow/creator";
import { useChange, useSelectItemIds } from "src/redux/app/operations";
import { ItemId, Option, isSym, isFlow, Flow, Sym } from "src/redux/items/types";
import { optionInputs, UpdateOption } from "src/items/option";
import { terminalStartSymCreator } from "src/items/terminalStart/creator";
import { terminalEndSymCreator } from "src/items/terminalEnd/creator";
import { addableItemTypes, ItemType, itemTypes } from "src/items/itemTypes";
import { getItem } from "src/redux/items/selectors";
import { mustString } from "src/lib/typechecker";
import Stack from "@mui/material/Stack";

export interface EditSidebarProps { }

const EditSidebar: FC<EditSidebarProps> = () => {
    const { setItem, removeItem } = useItemOperations();
    const [, { addFlow }] = useFlows();
    const { notifyChange } = useChange();

    const handleAddFlow = () => {
        const flowId = makeItemId("flow-id");

        const childSymId1 = makeItemId();
        const childSym1 = terminalStartSymCreator(childSymId1, flowId);
        const childSymId2 = makeItemId();
        const childSym2 = terminalEndSymCreator(childSymId2, flowId);

        const flow = flowCreatorWithChildren(
            flowId,
            [childSymId1, childSymId2],
            null
        );

        setItem(childSym1);
        setItem(childSym2);
        setItem(flow);

        addFlow(flowId);

        notifyChange();
    };

    const [selectItemIds] = useSelectItemIds();
    const [selectItem, { set: setSelectItem }] = useItem(selectItemIds[0]);
    const [flows, { removeFlow }] = useFlows();

    const [openTCDialog, setOpenTCDialog] = useState(false);
    const handleOpenDialog = () => {
        if (isSym(selectItem)) {
            setOpenTCDialog(true);
        }
    };
    const handleCloseDialog = () => {
        setOpenTCDialog(false);
    };
    const handleCT = (itemType: ItemType) => {
        //selectItemのitemTypeをを変更
        const _itemType = itemTypes[itemType];
        if (_itemType && selectItem) {
            const newItem = _itemType.creator(
                selectItem.itemId,
                selectItem.parentItemId
            );
            setSelectItem(newItem);
            handleCloseDialog();
            notifyChange();
        }
    };
    const handleRemove = () => {
        if (isSym(selectItem)) {
            selectItemIds.forEach((itemId) => {
                removeItem(itemId)
            })
            notifyChange();
        }
        if (isFlow(selectItem)) {
            selectItemIds.forEach(itemId => {
                console.log("remove flow", itemId)
                removeFlow(itemId);
                removeItem(itemId);
            })
            notifyChange();
        }
    };

    const changeTargetTypes = addableItemTypes.filter(
        (itemType) => itemType !== selectItem?.itemType
    );
    return (
        <Box>
            {/* <Typography color="text.secondary">編集モード</Typography> */}

            <Button variant="outlined" onClick={handleAddFlow}>
                フローを追加
            </Button>

            {selectItem && (
                <List>
                    {isSym(selectItem) ? (
                        <>
                            <Typography color="text.secondary">選択中の記号</Typography>
                            <Button variant="outlined" onClick={handleOpenDialog}>
                                {" "}
                                記号の種類を変更{" "}
                            </Button>
                            <Button variant="outlined" onClick={handleRemove}>
                                記号を削除
                            </Button>

                            <Typography color="text.secondary">
                                オプション
                            </Typography>
                            {selectItem.options.map((o) => (
                                <>
                                    <OptionRow
                                        key={o.name}
                                        itemId={selectItem.itemId}
                                        name={o.name}
                                    />
                                </>
                            ))}
                        </>
                    ) : isFlow(selectItem) ? (
                        <>
                            <Box>
                                {/* flow を編集する */}
                                <Typography color="text.secondary">
                                    選択中のフロー
                                </Typography>
                                <Button variant="outlined" onClick={handleRemove}>
                                    フローを削除
                                </Button>
                                <FlowEdit
                                    itemId={selectItem.itemId}
                                />
                            </Box>
                        </>
                    ) : ""}
                </List>
            )}
            <Dialog open={openTCDialog} onClose={handleCloseDialog}>
                <DialogTitle> 記号の種類を変更 </DialogTitle>
                <DialogContent>
                    <List>
                        {changeTargetTypes.length <= 0
                            ? "変更できません"
                            : changeTargetTypes.map((itemType) => {
                                return (
                                    <ListItem
                                        key={itemType}
                                        button
                                        onClick={() => handleCT(itemType)}
                                    >
                                        {itemTypes[itemType].label}
                                    </ListItem>
                                );
                            })}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}> 閉じる </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
export default React.memo(EditSidebar);

const OptionRow = React.memo(
    ({ name, itemId }: { name: string; itemId: ItemId }) => {
        const [openDialog, setOpenDialog] = useState(false);
        const option = useSelector((state: StoreState) => {
            const item = state.items.find((item) => item.itemId === itemId);
            if (!isSym(item)) return;
            return item.options.find((o) => o.name === name);
        });
        if (!option) return <div># ERROR {name} option is not exist </div>;
        const handleClose = () => setOpenDialog(false);
        const handleOpen = () => setOpenDialog(true);
        if (!option.visible) return <></>;
        return (
            <>
                <OptionListItem
                    key={option.name}
                    itemId={itemId}
                    option={option}
                    onOpenDialog={handleOpen}
                />
                <OptionDialog
                    itemId={itemId}
                    option={option}
                    show={openDialog}
                    onClose={handleClose}
                />
            </>
        );
    }
);


const FlowEdit = React.memo(
    ({ itemId }: { itemId: ItemId }) => {
        const [openDialog, setOpenDialog] = useState(false);
        const { setItem } = useItemOperations();
        const flow = useSelector(getItem(itemId));
        const tag = useSelector((state: StoreState) => {
            const item = getItem(itemId)(state)
            if (!isFlow(item)) return null;
            return item.tag;
        })
        const { notifyChange } = useChange();
        if (!flow || tag === null) return <># ERROR !</>
        const option: Option = {
            name: "タグ",
            type: "text",
            value: tag,
            visible: true
        };
        const handleOpen = () => setOpenDialog(true);
        const handleClose = () => setOpenDialog(false);
        const handleUpdate: UpdateOption = (newValue) => {
            mustString(newValue);
            const newFlow: Flow = {
                ...flow,
                tag: "" + newValue as string,
            };
            setItem(newFlow)
            notifyChange();
        };
        const Input = optionInputs[option.type].component;
        return <>
            <OptionListItem
                itemId={itemId}
                option={option}
                onOpenDialog={handleOpen}
            />
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>{option.name} の編集</DialogTitle>
                <DialogContent>
                    <Input option={option} updateOption={handleUpdate} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>閉じる</Button>
                </DialogActions>
            </Dialog>

        </>;
    });

const OptionListItem = React.memo(
    ({
        option,
        onOpenDialog,
    }: {
        itemId: ItemId;
        option: Option;
        onOpenDialog: () => void;
    }) => {
        return (
            <ListItem
                button
                onClick={onOpenDialog}
                secondaryAction={
                    <IconButton>
                        {" "}
                        <EditIcon />{" "}
                    </IconButton>
                }
            >
                <ListItemText
                    sx={{
                        px: 2,
                        lineBreak: "anywhere",
                    }}
                >
                    <Stack direction="row" justifyContent="space-between">
                        <Box>
                            {option.name} :
                        </Box>
                        <Box sx={{ color: "blue", }} component="span">
                            {option.value === true
                                ? "Yes"
                                : option.value === false
                                    ? "No"
                                    : option.value}
                        </Box>
                    </Stack>
                </ListItemText>
            </ListItem>
        );
    }
);

const OptionDialog = React.memo(
    ({
        option,
        show,
        onClose,
        itemId,
    }: {
        option: Option;
        show: boolean;
        onClose: () => void;
        itemId: ItemId;
    }) => {
        const { setOption } = useItemOperations();
        const { notifyChange } = useChange();
        // const [openDialog,setOpenDialog] = useState(false) ;
        const Input = optionInputs[option.type].component;
        const handleUpdate: UpdateOption = (newValue) => {
            setOption(itemId, option.name, newValue);
            notifyChange();
        };
        return (
            <Dialog open={show} onClose={onClose}>
                <DialogTitle>{option.name} の編集</DialogTitle>
                <DialogContent>
                    <Input option={option} updateOption={handleUpdate} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>閉じる</Button>
                </DialogActions>
            </Dialog>
        );
    }
);
