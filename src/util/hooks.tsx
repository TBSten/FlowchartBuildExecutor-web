

/*
usage



const [inputs,inputComps,setInputs] = useInputs({
  "name":"tbs",
  "pass":"10",
});

const log = ()=>{
  console.log(inputs);
}

const reset = ()=>{
  setInputs("name","tbs");
  setInputs("pass","10");
}

<div>
  {
    inputComps
  }

  <button onClick={log} > LOG </button>
  <button onClick={reset} > RESET </button>
</div>

*/

import React, { ReactNode, useCallback, useMemo, useState } from "react";

export function useInputs(initValues: {[key :string]:any}) :[object,ReactNode,<V>(name :string,value :V)=>void]{
    const [values, setValues] = useState(initValues) ;
    const setValue = useCallback(function <V>(name :string, value :V){
        const newValues = {
            ...values,
            [name]:value,
        } ;
        setValues(newValues);
        return ;
    },[values,setValues]);
    
    {/* function setValue<V>(name: string,value: V){
        const newValues = {
            ...values,
            [name]:value,
        } ;
        setValues(newValues);
        return ;
    } */}
    const inputComps :ReactNode = useMemo(()=>{return Object.keys(values).map((ele :string,idx :number)=>{
        const handleChange = (e :React.ChangeEvent<HTMLInputElement> )=>{
            setValue(ele,e.target.value);
        };
        return (<input type="text" 
            name={ele} 
            value={values[ele].toString() as string} 
            onChange={handleChange}
            key={idx}/>);
    })} ,[values]);
    return [
        values,
        inputComps,
        setValue,
    ] ;
}















