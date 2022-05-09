
import { Box, ListItem, ListItemText, Stack, Tooltip } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import React, { FC, useState } from "react";
import ErrorView from "src/components/util/ErrorView";
import { isValidFormula } from "src/lib/formula";
import { useOption } from "src/redux/items/hooks";
import { getItem } from "src/redux/items/selectors";
import { isSym, Item, ItemId, Option, OptionValue } from "src/redux/items/types";
import { useAppSelector } from "src/redux/root/hooks";


export type UpdateOption = (value: OptionValue) => any;
export type OptionInputComponent<P extends object = {}> = FC<P & {
    option: Option,
    updateOption: UpdateOption,
}>;
export interface OptionInput {
    component: OptionInputComponent,
};



const TextOptionInput: OptionInputComponent<TextFieldProps> = ({ option, updateOption, ...other }) => {
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        updateOption(e.target.value);
    };
    return (
        <Box>
            <TextField value={option.value} onChange={handleChange}  {...other} />
        </Box>
    );
};

const CheckOptionInput: OptionInputComponent = ({ option, updateOption }) => {
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        updateOption(e.target.checked);
    };
    if (typeof option.value !== "boolean") { return <># ERROR</> }
    return (
        <Box>
            <Checkbox
                value={option.value}
                checked={option.value}
                onChange={handleChange}
            />
        </Box>
    );
};

const SelectOptionInput: OptionInputComponent = ({ option, updateOption }) => {
    const value = option.value;
    const args = option.inputArgs;
    const handleChange = (e: SelectChangeEvent) => {
        updateOption(e.target.value);
    };
    if (!(args instanceof Array && typeof value === "string")) return <># ERROR </>
    return (
        <Box>
            <Select value={value} onChange={handleChange}>
                {args.map(arg => typeof arg === "string" ? (
                    <MenuItem key={arg} value={arg}>
                        {arg}
                    </MenuItem>
                ) : "ERROR!")}
            </Select>
            {/* select from {args.map(arg=><li key={arg.toString()}>{arg}</li>)} */}
        </Box>
    );
};
const FormulaOptionInput: OptionInputComponent = (props) => {
    const [isInvalidFormula, setIsInvalidFormula] = useState(false);
    const handleUpdate: UpdateOption = (value) => {
        props.updateOption(value);
        setIsInvalidFormula(false);
        setIsInvalidFormula(typeof value === "string" && !isValidFormula(value));
    }
    return <Box display="flex" flexWrap="wrap" color={theme => theme.palette.secondary.main}>
        <Box component="span" fontSize="0.75em" mr={0.5}>
            式
        </Box>
        <TextOptionInput
            {...props}
            updateOption={handleUpdate}
            error={isInvalidFormula}
            helperText={isInvalidFormula && "不正な式です"}
        />
    </Box>
}
const VariableNameOptionInput: OptionInputComponent = (props) => {
    return <Box display="flex" flexWrap="wrap" color={theme => theme.palette.secondary.main}>
        <Box component="span" fontSize="0.75em" mr={0.5}>
            変数
        </Box>
        <TextOptionInput {...props} />
    </Box>
}

export const optionInputs: {
    [key: string]: OptionInput
} = {
    // 実装済み
    "text": {
        component: TextOptionInput,
    },
    "checkbox": {
        component: CheckOptionInput,
    },
    "select": {
        component: SelectOptionInput,
    },
    "formula": {
        component: FormulaOptionInput,
    },
    "variableName": {
        component: VariableNameOptionInput,
    },

    // 未実装
    "multiText": {
        component: TextOptionInput,
    },
    "multiSelect": {
        component: TextOptionInput,
    },
    "conditionFormula": {
        component: TextOptionInput,
    },

};

export function getOption(item: Item, name: string) {
    if (isSym(item)) {
        const option = item.options.find(o => o.name === name);
        if (option) return option;
    }
    return null;
}


export interface OptionEditorProps {
    symId: ItemId;
}
export type SymOptionEditor = FC<OptionEditorProps>;
export const DefaultOptionEditor: SymOptionEditor = ({ symId }) => {
    const options = useAppSelector(state => {
        const item = getItem(symId)(state);
        return isSym(item) ? item.options : null;
    })
    if (!options) return <ErrorView>選択中のアイテムが異常です</ErrorView>
    return (
        <>
            {options?.map(option => (
                <DefaultOptionEditorRow
                    key={option.name}
                    itemId={symId}
                    name={option.name}
                />
            ))}
        </>
    );
}
export const DefaultOptionEditorRow = React.memo(
    ({
        name,
        itemId,
        description = "",
        error = false,
    }: {
        name: string;
        itemId: ItemId;
        description?: string,
        error?: boolean,
    }) => {
        const [option, setOption] = useOption(itemId, name);
        if (!option) return <Box># ERROR {name} option is not exist </Box>;
        if (!option.visible) return <></>;
        return (
            <>
                <OptionEditorListItem
                    key={option.name}
                    itemId={itemId}
                    option={option}
                    onChangeOptionValue={setOption}
                    description={description}
                />
            </>
        );
    }
);
export const OptionEditorListItem = React.memo(
    ({
        option,
        onChangeOptionValue,
        description,
    }: {
        itemId: ItemId;
        option: Option;
        onChangeOptionValue: (value: OptionValue) => void;
        description: string;
    }) => {
        return (
            <ListItem
                sx={theme => ({
                    borderBottom: `${theme.palette.text.disabled} 1px solid`,
                    mb: "0.5rem",
                })}
            >
                <ListItemText
                    sx={{
                        px: 2,
                        lineBreak: "anywhere",
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        flexWrap="wrap"
                    >
                        <Tooltip title={description} >
                            <Stack
                                justifyContent="center"
                                alignItems="center"
                                minWidth="fit-content"
                            >
                                {option.name} :
                            </Stack>
                        </Tooltip>
                        <Box sx={{ color: "blue", }} component="span">
                            <OptionComponent
                                option={option}
                                setOption={onChangeOptionValue}
                            />
                        </Box>
                    </Stack>
                </ListItemText>
            </ListItem>
        );
    }
);


export interface OptionComponentProps {
    option: Option;
    setOption: (value: OptionValue) => void;
}
export function OptionComponent({ option, setOption, }: OptionComponentProps) {
    const Comp = optionInputs[option.type].component;
    return <Comp option={option} updateOption={setOption} />
}

