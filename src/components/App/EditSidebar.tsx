import EditIcon from "@mui/icons-material/Edit";
import { ButtonGroup } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import React, { FC, useState } from "react";
import { flowCreatorWithChildren } from "src/items/flow/creator";
import { optionInputs, UpdateOption } from "src/items/option";
import { addableItemTypes, isSymType, SymType, symTypes } from "src/items/symTypes";
import { terminalEndSymCreator } from "src/items/terminalEnd/creator";
import { terminalStartSymCreator } from "src/items/terminalStart/creator";
import { makeItemId } from "src/items/util";
import { logger } from "src/lib/logger";
import { mustString } from "src/lib/typechecker";
import { useChange, useSelectItemIds } from "src/redux/app/operations";
import { useItem, useItemOperations } from "src/redux/items/operations";
import { getItem } from "src/redux/items/selectors";
import { Flow, isFlow, isSym, ItemId, Option } from "src/redux/items/types";
import { useFlows } from "src/redux/meta/operations";
import { useAppSelector } from "src/redux/root/operations";
import ErrorView from "../util/ErrorView";
import SidebarContent from "./SidebarContent";


export interface EditSidebarProps { }

const EditSidebar: FC<EditSidebarProps> = () => {
    const { setItem, removeItem } = useItemOperations();
    const [flows, { addFlow }] = useFlows();
    const { notifyChange } = useChange();

    const handleAddFlow = () => {
        const flowId = makeItemId("flow-id");

        const childSymId1 = makeItemId();
        const childSym1 = terminalStartSymCreator(childSymId1, flowId);
        const childSymId2 = makeItemId();
        const childSym2 = terminalEndSymCreator(childSymId2, flowId);

        if (flows.length > 0) {
            childSym1.options[0].value = `処理${flows.length}`;
        }

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
    const [, { removeFlow }] = useFlows();

    const [openTCDialog, setOpenTCDialog] = useState(false);
    const handleOpenDialog = () => {
        if (isSym(selectItem)) {
            setOpenTCDialog(true);
        }
    };
    const handleCloseDialog = () => {
        setOpenTCDialog(false);
    };
    const handleCT = (itemType: SymType) => {
        //selectItemのitemTypeをを変更
        if (!isSymType(itemType)) {
            logger.error(itemType, "is not symType")
            return;
        }
        const _itemType = symTypes[itemType];
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
            <SidebarContent>
                <Button variant="outlined" onClick={handleAddFlow}>
                    フローを追加
                </Button>
            </SidebarContent>

            {selectItem && (
                <>
                    {isSym(selectItem) ? (
                        <>
                            <SidebarContent title="選択中の記号">
                                <ButtonGroup variant="outlined">
                                    <Button onClick={handleOpenDialog}>
                                        {" "}
                                        記号の種類を変更{" "}
                                    </Button>
                                    <Button onClick={handleRemove}>
                                        記号を削除
                                    </Button>
                                </ButtonGroup>
                            </SidebarContent>

                            <SidebarContent title="オプション">
                                {selectItem.options.map((o) => (
                                    <>
                                        <OptionRow
                                            key={o.name}
                                            itemId={selectItem.itemId}
                                            name={o.name}
                                        />
                                    </>
                                ))}
                            </SidebarContent>
                        </>
                    ) : isFlow(selectItem) ? (
                        <>
                            <SidebarContent title="選択中のフロー">
                                {/* flow を編集する */}
                                <Button variant="outlined" onClick={handleRemove}>
                                    フローを削除
                                </Button>
                                <FlowEdit
                                    itemId={selectItem.itemId}
                                />
                            </SidebarContent>
                        </>
                    ) : ""}
                </>
            )}
            <Dialog open={openTCDialog} onClose={handleCloseDialog}>
                <DialogTitle> 記号の種類を変更 </DialogTitle>
                <DialogContent>
                    <List>
                        {changeTargetTypes.length <= 0
                            ? "変更できません"
                            : changeTargetTypes.map((itemType) => {
                                if (!isSymType(itemType)) return <ErrorView>{itemType} is not symType</ErrorView>
                                return (
                                    <ListItem
                                        key={itemType}
                                        button
                                        onClick={() => handleCT(itemType)}
                                    >
                                        {symTypes[itemType].label}
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
        const option = useAppSelector(state => {
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
        const flow = useAppSelector(getItem(itemId));
        const tag = useAppSelector(state => {
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
