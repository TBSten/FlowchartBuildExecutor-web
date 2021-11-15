import { useState } from "react" ;
import { Table,TableBody,TableCell,TableHead,TableRow, } from "@material-ui/core";
import { setRuntime, useRuntime } from "redux/reducers/exes";
import Runtime from "./Runtime";
import { Variable, VariableValue } from "./types";
import MultiText from "components/util/MultiText" ; 
import { useDispatch } from "react-redux";

function TableTab(){
    const runtime = useRuntime() as TableRuntime ;
    const his = runtime.outputHistory ;
    const headers = runtime.outputHeader ;
    const rowCnt = his[0]?.length ;
    console.log(headers,his);
    for(let i = headers.length ; i < rowCnt;i++){
        headers.push(`列${i+1}`);
    }
    return (
        <Table>
            {/* ヘッダ */}
            <TableHead><TableRow>
            {
                headers.map((cell,idx)=>(
                    <TableCell key={idx}>{cell}</TableCell>
                ))
            }
            </TableRow></TableHead>
            {/* データ */}
            <TableBody>
            {
                his.map((row,idx)=>(
                    <TableRow key={idx}>
                        {
                            row.map((cell,idx)=>(
                                <TableCell key={idx}>
                                    {cell}
                                </TableCell>
                            ))
                        }
                    </TableRow>
                ))
            }
            </TableBody>

            { his.length <= 0 && headers.length <= 0 ? "※出力された行がありません" : ""}

        </Table>
    ) ;
}

function SettingTab(){
    const runtime = useRuntime() as TableRuntime ;
    const dispatch = useDispatch() ;
    const [cols,setCols] = useState(runtime.outputHeader );
    const handleChange = (nv:string[])=>{
        setCols(nv as string[]);
        runtime.outputHeader = nv ;
        dispatch(setRuntime(runtime));
    };

    return (
        <div>
            <h6> 列の見出し </h6>
            <MultiText values={cols} onChangeValues={handleChange}/>
        </div>
    ) ;
}

export default class TableRuntime extends Runtime {
    outputHeader :string[];
    outputHistory :string[][];
    constructor(flowIds: string[], vars: Variable[]) {
        super(flowIds, vars);
        this.name = "テーブル（表形式）";
        this.description = "出力を表形式で出力します";
        this.outputHistory = [] ;
        this.outputHeader = [] ;
    }
    async output(data: string) {
        const line = data.split(",").map(el=>this.eval(el).toString());
        console.log("table runtime output :",line);
        this.outputHistory.push(line);
    }
    async input(msg: string) {
        return await this.inputBox(msg);
    }
    getTabs() {
        const ans = [
            {
                label: "実行結果",
                comp: <TableTab />,
            },
            {
                label : "表の設定",
                comp : <SettingTab />
            }
        ];
        return ans;
    }
}
