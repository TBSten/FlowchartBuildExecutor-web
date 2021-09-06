import {
    Button, 
} from "@material-ui/core" ;


import styled from "styled-components" ;
import {sp} from "../../css/media" ;
import { useGetItem, setOption, removeItem,  } from "redux/reducers/items" ;
import {toggleMulti, useSelectItemId, useSelectItemIds, useMultiSelect, selectItemById} from "redux/reducers/selectItem" ;
import { ReactNode, } from "react";
import { useDispatch } from "react-redux";



const SideBarContainer = styled.div`
    overflow: auto;
    padding: 1.5rem;
    padding-bottom: 60px;
    h6{
        margin: 0.3rem 0;
    }
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
    const multiSelect = useMultiSelect() ;

    const getItem = useGetItem();

    let child :string | ReactNode = <div>none selected</div> ;
    const menus = [];

    const handleRemove = ()=>{
        console.log(selectItemIds);
        selectItemIds.forEach(id=>{
            dispatch(removeItem(id));
        });
    };
    const handleUnselect = ()=>{
        dispatch(selectItemById(selectItemId));
    };
    const handleUnselectAll = ()=>{
        dispatch(selectItemById("none"));
    };
    const handleToggleMultiSelect = ()=>{
        dispatch(toggleMulti(!multiSelect));
    };
    const item = getItem(selectItemId);
    const dispatch = useDispatch();
    if(selectItemId !== "none" && item){
        child = item.options.map((ele,idx)=>{
            const Input = ele.type.input ? 
                ele.type.input
                :
                ()=><># Error: valid option type, name:{ele.name} value:{ele.value} type:{ele.type}</> ;
            const updateOption = (name :string,value :string | number | boolean) => {
                console.log("dispatch setOption :",name,value);
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
                <h6>記号の操作</h6>
                <Button onClick={handleRemove} color="primary" variant="outlined">
                    記号を削除
                </Button>
                <h6>記号の選択</h6>
                <Button onClick={handleUnselect} color="primary" variant="outlined">
                    選択解除
                </Button>
                <Button onClick={handleUnselectAll} color="primary" variant="outlined">
                    全て選択解除
                </Button>

            </>
        );
    }
    menus.push([
        <Button onClick={handleToggleMultiSelect} color="primary" variant="outlined" key={"multiSelect"}>
            {!multiSelect?
            "複数選択モード"
            :
            "複数選択モード解除"
            }
        </Button>,
    ]);
    menus.push([
        <Button variant="outlined" color="primary" key={"newFlow"}>
            フローを追加
        </Button>,
    ]);
    return (
        <SideBarContainer>
            {
                child
            }
            <hr/>
            <h6>メニュー</h6>
            {
                menus
            }
        </SideBarContainer>
    ) ;
}

