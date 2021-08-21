
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
    const {selectItemId, getItem,setOption } = useEditItems();
    let child :string | ReactNode = <tr><td>none selected</td></tr> ;
    if(selectItemId >= 0){
        const item = getItem(selectItemId);
        child = item.options.map((ele,idx)=>{
            // console.log(ele);
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
    }
    return (
        <SideBarContainer>
            <table><tbody>
                {
                    child
                }
            </tbody></table>
        </SideBarContainer>
    ) ;
}

