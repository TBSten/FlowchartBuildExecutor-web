// import { ReactNode } from "react";
import {TextField, Select, Checkbox, MenuItem, } from "@material-ui/core" ;
import React, { FC, useState, useEffect,  } from "react";
import { useTopArrayTemplates } from "redux/reducers/top";
import Button from "components/util/Button" ;
import { SelectChangeEvent } from "@mui/material/Select";

export type OptionType = {
    name:string;
    input: ()=>FC<{
        name :string, 
        value :string | number | boolean, 
        args :string | number | boolean | string[] | number[] | object,
        updateOption :(name :string,value :string | number | boolean)=>void,
    }>;

} ;



export const optionTypes :{ [key :string]:OptionType } = {
    "text":{
        name:"text",
        input:()=>function OptionTextField({name,value,updateOption}){
            const [inputValue,setInputValue] = useState(value);
            useEffect(()=>{
                console.log("did mount");
            },[]);
            const handleChange = (e :React.ChangeEvent<HTMLInputElement>)=>{
                setInputValue(e.target.value);
                // updateOption(name,e.target.value);

            }
            const handleUpdate = ()=>{
                updateOption(name,inputValue);
            } ;
            return (
                <TextField size="small" variant="outlined" value={inputValue} onBlur={handleUpdate} onChange={handleChange}/>
            )
        },
    },
    "check":{
        name:"check",
        input:()=>({name,value,updateOption})=>(
            <Checkbox value={value} onChange={(e)=>{updateOption(name,e.target.checked);console.log("onChange",e.target.checked)}}/>
        ),
    },
    "select":{
        name:"select",
        input:()=>({name,value,args,updateOption})=>(
            <Select value={value} onChange={(e)=>{updateOption(name,e.target.value as string);}}>
                {
                    (args as string[]).map((ele,idx)=>(
                        <MenuItem key={idx} value={ele}>{ele}</MenuItem>
                    ))
                }
            </Select>
        ),
    },
    //arrayTemplate
    "arrayTemplate":{
        name:"arrayTemplate",
        input:()=>function ArrayTemplateInput({name,value,args,updateOption}){
            const ats = useTopArrayTemplates() ;
            function handleNew(){
            }
            function handleEdit(){
            }
            return (
                <>
                    <Select value={value} onChange={e=> updateOption(name, e.target.value as string) }>
                        <MenuItem value="None">None</MenuItem>
                    {
                        ats.map(at => (
                            <MenuItem key={at.name} value={at.name}> 
                                {at.name} : {at.value} 
                            </MenuItem>
                        ))
                    }
                        <MenuItem value="Test">Test</MenuItem>
                    </Select>
                    <div>
                        <Button onClick={handleNew}>New</Button>
                        <Button onClick={handleEdit}>Edit</Button>
                    </div>

                    {/* new and edit dialog */}

                </>
            ) ;
        },
    },
    //multi args:[{type:"text",args:null}, ]
} as const;


export function corners(w :number,h :number,lw :number) {
    return {
        "leftTop":[lw/2,lw/2],
        "leftCenter":[lw/2,h/2],
        "leftBottom":[lw/2,h-lw/2],
        "centerTop":[w/2,lw/2],
        "centerBottom":[w/2,h-lw/2],
        "rightTop":[w-lw/2,lw/2],
        "rightCenter":[w-lw/2,h/2],
        "rightBottom":[w-lw/2,h-lw/2],
    } as const;
}




