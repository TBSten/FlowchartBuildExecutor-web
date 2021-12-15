import {useState} from "react" ;
import TextField from "@material-ui/core/TextField";

export interface InputableTextProps{
    value: string|number;
    onChange:(newValue:string)=>void;
}
export default function InputableText({value,onChange}:InputableTextProps){
    const [mode,setMode] = useState<"view"|"input">("view");
    function handleViewMode(){setMode("view")}
    function handleInputMode(){setMode("input")}
    return (
        mode==="view"?
            <div onClick={handleInputMode} style={{minHeight:"1em"}}>
                {value?value:"! none title !"}
            </div>
        :
            <TextField
                onChange={(e)=>onChange(e.target.value)}
                // onInput={handleViewMode}
                // onSubmit={handleViewMode}
                onBlur={handleViewMode}
                value={value}/>
    ) ;
}


