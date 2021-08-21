import { atom, } from 'recoil';

export const selectItemState = atom<number>({
    key:"selectItem",
    default:-1
});
export const modesState = atom<{name:string, }[]>({
    key:"modes",
    default:[
        {name:"edit",},
        {name:"exe",},
    ],
});
export const modeState = atom<string>({
    key:"mode",
    default:"edit",
});
