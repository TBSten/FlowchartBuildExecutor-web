import { Grid } from "@material-ui/core";
import { sp } from "css/media";
import { useRuntime } from "redux/reducers/exes";
import styled from "styled-components" ;
import VariableTracer from "./VariableTracer";


const ScCon = styled.div`
    width: 100%;
    overflow: auto;
`;
const TracerCon = styled.div`
    background: #ececec;
    overflow: auto;
    width: max-content;
    display:grid;
    gap:16px;
    padding: 1rem;
    box-sizing: border-box;
    ${sp`
        padding: 5px ;
    `}
`;

export default function TracerPane(){
    const runtime = useRuntime() ;
    const vars = runtime.variables ;
    return (
        <ScCon>
            <TracerCon>
            {
                vars.length > 0 ?
                vars.map(el=>{
                    console.log("Trace :",el);
                    return (
                        <VariableTracer {...el}/>
                    ) ;
                })
                :
                <li> none Variables </li>
            }
            </TracerCon>
        </ScCon>
    ) ;
} ;

