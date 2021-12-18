import { useEffect } from "react";
import { useRuntime } from "redux/reducers/exes";
import Runtime from "./Runtime" ;
import { Variable, } from "./types";
// import { TabData } from "components/App/types";
import styled from "styled-components" ;

const TerminalContainer = styled.div`
    background :black ;
    color :white ;
    width :100%;
    height :100%;
`;
const TerminalContent = styled.ul`
    list-style :none;
    margin-left:0.5rem;
    overflow :auto;
`;
const LastRow = styled.li`
    color: #eeff00;
    transition:1s;
`;
const RedRow = styled.li`
    color: #eb0000;
`;

function TerminalTab(){
    const runtime = useRuntime() as TerminalRuntime;
    const history = runtime.outputHistory ?? [];
    useEffect(()=>{
        console.log("TerminalTab.mount");
    },[]);
    return (
        <TerminalContainer>
            <h1>
                {runtime.name}
            </h1>
            <TerminalContent>
                {
                    history.map((line,i)=>(
                        i !== history.length-1 ?
                        <li key={i}> {line} </li>
                        :
                        <LastRow key={i}> {line} </LastRow>
                    ))
                }
            </TerminalContent>
        </TerminalContainer>
    ) ;
}
export default class TerminalRuntime extends Runtime {
    outputHistory :string[] ;
    constructor(flowIds: string[], vars: Variable[]){
        super(flowIds, vars) ;
        this.name = "ターミナル" ;
        this.description = "ターミナルタブに一覧で出力します" ;
        this.outputHistory = [] ;
    }
    async output(data :string){
        console.log("<<<<<<<<output start");
        const lines = data.split(",").map(el=>this.eval(el).toString());
        // await this.msgBox(data.toString());
        this.outputHistory = [...this.outputHistory, ...lines ] ;
        console.log("<<<<<<<<output end");
    }
    async input(msg :string) {
        return await this.inputBox(msg);
    }
    getTabs(){
        console.log("getTabs");
        return [
            {
                label:"ターミナル",
                comp:<TerminalTab />
            },
        ] ;
    }
    async onError(e:Error, displayName:string|null){
        super.onError(e,displayName);
        //outputHistoryにエラーとして登録
    }
}

