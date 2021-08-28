import { atom, } from 'recoil';

export const selectItemState = atom<string>({
    key:"selectItem",
    default:"none"
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
