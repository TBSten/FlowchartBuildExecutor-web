import { Card, CardContent, Typography,  } from "@material-ui/core";
import { VariableValue } from "exe/runtimes/types";
import React from "react";
import styled from "styled-components" ;

const ValueCon = styled.div`
    word-break:break-all;
`;
const Block = styled.div`
    border: solid 1px black;
    padding: 0.8rem 1rem;
`;
const BlockRow = styled.div`
    display: flex;
    flex-direction: row;
    border: solid 1px black;
`;

interface VariableTracerProps{
    name :string;
    value :VariableValue;
}

const VariableTracer :React.FC<VariableTracerProps> = 
    ({name, value})=>{

    let Comp :JSX.Element|any[] = <># ERROR unvalid value:{value}</> ;
    if(!(value as unknown instanceof Array)){
        if(value === true) {
            Comp = <>true</>
        }else if(value === false) {
            Comp = <>false</>
        }else{
            Comp = <>{value}</> ;
        }
    }else{
        const _value = value as unknown as any[]
        if(! (_value[0] instanceof Array)){
            //1次元配列
            Comp = (
                <BlockRow>
                    {_value.map(el=>(
                        <Block>{el}</Block>
                    ))}
                </BlockRow>
            );
        }else if(_value[0] instanceof Array){
            //2次元配列
            const arr = _value as any[][] ;
            Comp = arr.map(row=>(
                <BlockRow>{row.map(el=>(
                    <Block>{el}</Block>
                ))}</BlockRow>
            ))
        }
    }
    return (
        <div>
            <Typography gutterBottom>
                {name}
            </Typography>
            <Card style={{width:"max-content"}}>
                <CardContent>
                    <Typography variant="h5">
                        <ValueCon>
                            {Comp}
                        </ValueCon>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    ) ;
}
export default VariableTracer ;

