import { ButtonGroup, Slide } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import React, { FC, useState } from "react";
import { flowCreatorWithChildren } from "src/items/flow/creator";
import { DefaultOptionEditorListItem, UpdateOption } from "src/items/option";
import { addableItemTypes, isSymType, SymType, symTypes } from "src/items/symTypes";
import { terminalEndSymCreator } from "src/items/terminalEnd/creator";
import { terminalStartSymCreator } from "src/items/terminalStart/creator";
import { makeItemId } from "src/items/util";
import { logger } from "src/lib/logger";
import { mustString } from "src/lib/typechecker";
import { useChange, useSelectItemIds } from "src/redux/app/hooks";
import { useItem, useItemOperations } from "src/redux/items/hooks";
import { getItem } from "src/redux/items/selectors";
import { Flow, isFlow, isSym, ItemId, Option } from "src/redux/items/types";
import { useTopFlows } from "src/redux/meta/hooks";
import { useAppSelector } from "src/redux/root/hooks";
import ErrorView from "../util/ErrorView";
import SidebarContent from "./SidebarContent";


export interface EditSidebarProps { }

const EditSidebar: FC<EditSidebarProps> = () => {
    const { setItem, removeItem, } = useItemOperations();
    const [flows, { addTopFlow: addFlow }] = useTopFlows();
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
    const selectItemType = selectItem?.itemType;
    const [, { removeTopFlow: removeFlow, }] = useTopFlows();

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
        logger.log("remove", selectItemIds)
        selectItemIds.forEach(itemId => {
            removeFlow(itemId);
            removeItem(itemId);
        })
        notifyChange();
    };

    const changeTargetTypes = addableItemTypes.filter(
        (itemType) => itemType !== selectItem?.itemType
    );
    return (
        <Box>
            <SidebarContent title="基本操作">
                <Button variant="outlined" onClick={handleAddFlow}>
                    フローを追加
                </Button>
            </SidebarContent>

            <Slide direction="up" mountOnEnter unmountOnExit in={isSym(selectItem)}>
                <Box>
                    <SidebarContent title="選択中の記号" defaultExpanded>
                        <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
                            <Button onClick={handleOpenDialog}>
                                {" "}
                                記号の種類を変更
                                {" "}
                            </Button>
                            <Button
                                onClick={handleRemove}
                                disabled={!selectItem?.flgs?.delete}
                            >
                                記号を削除
                            </Button>
                        </ButtonGroup>
                        {isSymType(selectItemType) && (() => {
                            const OptionEditor = symTypes[selectItemType].optionEditor;
                            return <OptionEditor symId={selectItemIds[0]} />
                        })()}
                    </SidebarContent>

                    {/* <SidebarContent title="オプション">
                    </SidebarContent> */}
                </Box>
            </Slide>

            <Slide direction="up" mountOnEnter unmountOnExit in={isFlow(selectItem)}>
                <Box>
                    <SidebarContent title="選択中のフロー">
                        {/* flow を編集する */}
                        <Button
                            variant="outlined"
                            onClick={handleRemove}
                        >
                            フローを削除
                        </Button>
                        <FlowEdit
                            itemId={selectItem?.itemId ?? ""}
                        />
                    </SidebarContent>
                </Box>
            </Slide>

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




const FlowEdit = React.memo(
    ({ itemId }: { itemId: ItemId }) => {
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
        const handleUpdate: UpdateOption = (newValue) => {
            mustString(newValue);
            const newFlow: Flow = {
                ...flow,
                tag: "" + newValue as string,
            };
            setItem(newFlow)
            notifyChange();
        };
        return (
            <DefaultOptionEditorListItem
                itemId={flow.itemId}
                option={option}
                onChangeOptionValue={handleUpdate}
                description=""
            />
        )
    });

