import { atom, selector, useRecoilState, useRecoilValue } from "recoil";


export const t1State = atom<{name :string, old :number}[]>({
    key:"t1",
    default:[
        {name:"A", old:10,},
        {name:"B", old:18,},
        {name:"C", old:15,},
        {name:"D", old:14,},
    ]
});

export const t2State = atom<{name :string, old :number}[]>({
    key:"t2",
    default:[
        {name:"A", old:10,},
        {name:"B", old:18,},
        {name:"C", old:15,},
        {name:"D", old:14,},
    ]
});


export default function useAtomTest(){
    const [t1,setT1] = useRecoilState(t1State);
    const [t2,setT2] = useRecoilState(t2State);
    return {
        t1,t2,
        setT1,setT2,
    } ;
}





