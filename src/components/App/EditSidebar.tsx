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
            childSym1.options[0].value = `??????${flows.length}`;
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
        //selectItem???itemType????????????
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
            <SidebarContent title="????????????" defaultExpanded>
                <Button variant="outlined" onClick={handleAddFlow}>
                    ??????????????????
                </Button>
            </SidebarContent>

            <Slide direction="up" mountOnEnter unmountOnExit in={isSym(selectItem)}>
                <Box>
                    <SidebarContent title="??????????????????" defaultExpanded>
                        <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
                            <Button onClick={handleOpenDialog}>
                                {" "}
                                ????????????????????????
                                {" "}
                            </Button>
                            <Button
                                onClick={handleRemove}
                                disabled={!selectItem?.flgs?.delete}
                            >
                                ???????????????
                            </Button>
                        </ButtonGroup>
                        {isSymType(selectItemType) && (() => {
                            const OptionEditor = symTypes[selectItemType].optionEditor;
                            return <OptionEditor symId={selectItemIds[0]} />
                        })()}
                    </SidebarContent>

                    {/* <SidebarContent title="???????????????">
                    </SidebarContent> */}
                </Box>
            </Slide>

            <Slide direction="up" mountOnEnter unmountOnExit in={isFlow(selectItem)}>
                <Box>
                    <SidebarContent title="?????????????????????" defaultExpanded>
                        {/* flow ??????????????? */}
                        <Button
                            variant="outlined"
                            onClick={handleRemove}
                        >
                            ??????????????????
                        </Button>
                        <FlowEdit
                            itemId={selectItem?.itemId ?? ""}
                        />
                    </SidebarContent>
                </Box>
            </Slide>

            <Dialog open={openTCDialog} onClose={handleCloseDialog}>
                <DialogTitle> ???????????????????????? </DialogTitle>
                <DialogContent>
                    <List>
                        {changeTargetTypes.length <= 0
                            ? "?????????????????????"
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
                    <Button onClick={handleCloseDialog}> ????????? </Button>
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
            name: "??????",
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

