import { TextField,List,ListItem,ListItemText,ListProps,Button,IconButton, } from "@material-ui/core";
import {Delete} from "@material-ui/icons" ; 

export type MultiTextProps<V=string> = ListProps & {
    values?:V[];
    onChangeValues?:(newValues:V[])=>void;
} ;

/**
 * # MultiText
 * ## usage
 * ```javascript
 * const [values,] = useState(["aaa","bbb"]) ;
 * 
 * <MultiText values={values} onChange={(values)=>setValues(values)}/>
 * 
 * TextField:aaa
 * TextField:bbb
 * Button:+add
 * 
 * ```
 */
export default function MultiText(props :MultiTextProps) {
    let { values,onChangeValues,...other} = props ;
    values = values?values:[] ;
    function makeHandleChange(idx:number){
        return (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
            const vs = values?values:[] ;
            const newValues = [...vs] ;
            newValues[idx] = e.target.value ;
            if(onChangeValues){
                onChangeValues(newValues);
            }
        };
    }
    function makeHandleDelete(idx:number){
        return ()=>{
            const vs = values?values:[] ;
            if(onChangeValues){
                onChangeValues(vs.filter( (el,i)=>i!==idx ));
            }
        } ;
    }
    function handleClickAdd(){
        const vs = values?values:[] ;
        if(onChangeValues){
            onChangeValues([...vs,`列${vs.length+1}`]);
        }
    }
    return (
        <List {...other}>
            {
                values.map((value,idx)=>(
                    <ListItem>
                        <TextField 
                            onChange={makeHandleChange(idx)} 
                            value={value}/>
                        <IconButton onClick={makeHandleDelete(idx)}>
                            <Delete/>
                        </IconButton>
                    </ListItem>
                ))
            }
            {/* add button */}
            {
                values.length <= 0 ? 
                <ListItem><ListItemText>列がありません</ListItemText></ListItem>:""
            }
            <ListItem>
                <Button onClick={handleClickAdd}>+ 追加</Button>
            </ListItem>
        </List>
    ) ;
}


