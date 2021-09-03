import {
    Button,
} from "@material-ui/core" ;


import styled from "styled-components" ;
import {sp} from "../../css/media" ;
import { useGetItem, setOption, removeItem,  } from "redux/reducers/items" ;
import {useSelectItemId, useSelectItemIds} from "redux/reducers/selectItem" ;
import { ReactNode, } from "react";
import { useDispatch } from "react-redux";



const SideBarContainer = styled.div`
    overflow: auto;
    padding: 1.5rem;
    padding-bottom: 60px;
    ${sp`
        padding:0.3rem;
        padding-bottom: 60px;
        max-height: 35vh;
        box-sizing: border-box;
    `}
`;

export default function SideBar(){
    const selectItemIds = useSelectItemIds();
    const selectItemId = useSelectItemId();
    const getItem = useGetItem();

    let child :string | ReactNode = <div>none selected</div> ;
    const handleRemove = ()=>{
        console.log(selectItemIds);
        selectItemIds.forEach(id=>{
            dispatch(removeItem(id));
        });
    };
    const item = getItem(selectItemId);
    const dispatch = useDispatch();
    if(selectItemId !== "none" && item){
        child = item.options.map((ele,idx)=>{
            const Input = ele.type.input ? 
                ele.type.input
                :
                ()=><># Error: valid option type, name:{ele.name} value:{ele.value} type:{ele.type}</> ;
            const updateOption = (name :string,value :string | number) => {
                dispatch(setOption(selectItemId, name, value));
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

