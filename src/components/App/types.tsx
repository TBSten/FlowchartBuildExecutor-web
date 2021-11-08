import { ReactNode } from "react";

// 実行モード時のタブ
export interface TabData{
    label:string;
    comp:ReactNode;
} ;

// サイドバーのメニューから開くことができるメニュー
export interface SideBarMenu{
    label:string;
    onClick:()=>void;
    icon?:ReactNode;
}

