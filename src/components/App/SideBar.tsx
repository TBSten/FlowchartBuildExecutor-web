import {
    Button,
} from "@material-ui/core" ;

import styled from "styled-components" ;
import {sp} from "../../css/media" ;
import {useEditItems} from "atom/syms" ;
import { ReactNode, } from "react";


const SideBarContainer = styled.div`
    overflow: auto;
    padding:1.5rem;
    max-height: 40vh;
    ${sp`
        padding:0.3rem;
    `}
`;

export default function SideBar(){
    const {selectItemId, getItem, setOption, removeItem, } = useEditItems();
    let child :string | ReactNode = <div>none selected</div> ;
    const handleRemove = ()=>{
        removeItem(selectItemId);
    };
    const item = getItem(selectItemId);
    if(selectItemId >= 0 && item){
        child = item.options.map((ele,idx)=>{
            const Input = ele.type.input ? 
                ele.type.input
                :
                ()=><># Error: valid option type, name:{ele.name} value:{ele.value} type:{ele.type}</> ;
            const updateOption = (name :string,value :string | number) => {
                // console.log(`updateOption ::`,selectItemId,name,value);
                setOption(selectItemId,name,value);
            };
            return (
                <tr key={idx} >
                    <td>
                        {ele.name}
                    </td>
                    <td>
                        <Input 
                            name={ele.name} 
                            value={ele.value} 
                            args={ele.args}
                            updateOption={updateOption}/>
                    </td>
                </tr>
            ) ;
        }) ;
        child = (
            <>
                <h6>オプション</h6>
                <table><tbody>
                    {child}
                </tbody></table>
                <h6>メニュー</h6>
                <div>
                    <Button onClick={handleRemove} color="primary" variant="contained">
                        記号を削除
                        </Button>
                </div>
            
            </>
        );
    }
    return (
        <SideBarContainer>
            {
                child
            }
        </SideBarContainer>
    ) ;
}

