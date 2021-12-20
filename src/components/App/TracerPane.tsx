// import { Grid } from "@material-ui/core";
import { sp } from "css/media";
import { useRuntime } from "redux/app/hooks";
import styled from "styled-components" ;
import { nullable } from "util/nullable";
import VariableTracer from "./VariableTracer";


const ScCon = styled.div`
    width: 100%;
    overflow: auto;
`;
const TracerCon = styled.div`
    background: #ececec;
    overflow: auto;
    width: max-content;
    gap:16px;
    padding: 1rem;
    box-sizing: border-box;
    width:100%;
    display:flex;
    flex-wrap:wrap ;
    ${sp`
        padding: 5px ;
    `}
`;

export default function TracerPane(){
    const runtime = useRuntime() ;
    const vars = nullable(runtime).variables ;
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
                <b> 変数がありません </b>
            }
            </TracerCon>
        </ScCon>
    ) ;
} ;

