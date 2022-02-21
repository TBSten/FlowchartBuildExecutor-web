
import Checkbox from "@mui/material/Checkbox";
import Select,{SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { FC } from "react";
import { isSym, Item, Option, OptionValue } from "src/redux/items/types" ;


export type UpdateOption = (value:OptionValue)=>any ;
export type OptionInputComponent = FC<{
    option:Option,
    updateOption:UpdateOption,
}> ;
export interface OptionInput{
    component:OptionInputComponent,
} ;



const TextOptionInput :OptionInputComponent = ({option,updateOption})=>{
    const handleChange:React.ChangeEventHandler<HTMLInputElement> = (e)=>{
        updateOption(e.target.value);
    } ;
    return (
        <div>
            <TextField value={option.value} onChange={handleChange}/>
        </div>
    ) ;
} ;

const CheckOptionInput :OptionInputComponent = ({option,updateOption})=>{
    const handleChange :React.ChangeEventHandler<HTMLInputElement> = (e)=>{
        updateOption(e.target.checked);
        console.log(e.target.checked);
    } ;
    console.log("checkbox option input",option)
    if(typeof option.value !== "boolean"){ return <># ERROR</> }
    return (
        <div>
            <Checkbox 
                value={option.value} 
                checked={option.value}
                onChange={handleChange}
            />
        </div>
    ) ;
} ;

const SelectOptionInput :OptionInputComponent = ({option,updateOption})=>{
    const value = option.value ;
    const args = option.inputArgs ;
    const handleChange = (e:SelectChangeEvent)=>{
        updateOption(e.target.value);
    } ;
    if(!(args instanceof Array && typeof value === "string") )return <># ERROR </>
    return (
        <div>
            <Select value={value} onChange={handleChange}>
                {args.map(arg=>typeof arg === "string" ? (
                    <MenuItem key={arg} value={arg}>
                        {arg}
                    </MenuItem>
                ):"ERROR!")}
            </Select>
            {/* select from {args.map(arg=><li key={arg.toString()}>{arg}</li>)} */}
        </div>
    ) ;
} ;

export const optionInputs:{
    [key:string]:OptionInput
} = {
    "text":{
        component:TextOptionInput,
    },
    "multiText":{
        component:TextOptionInput,
    },
    "checkbox":{
        component:CheckOptionInput,
    },
    "select":{
        component:SelectOptionInput,
    },
    "multiSelect":{
        component:TextOptionInput,
    },

} ;


// export function useOptionInputs(option:Option){
// }

export function getOption(item :Item,name :string){
    if(isSym(item)){
        const option = item.options.find(o=>o.name === name) ;
        if(option) return option ;
    }
    return null ;
}
