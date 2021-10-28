import { Item } from "redux/types/item";
import { useCalcSymCreator } from "./calc";
import { useDataSymCreator } from "./data";
import { useDoubleBranchSymCreator } from "./doubleBranch";
import { useForSymCreator } from "./for";
import { usePrepareSymCreator } from "./prepare";
import { useProcessSymCreator } from "./process";
import { useSwitchSymCreator } from "./switchBranch";
import { useWhileSymCreator } from "./while";


//itemCreators

export class ItemCreator{
    name :string;
    description :string;
    creator :()=> ()=>Item;
    constructor(
        name :string, 
        description :string, 
        creator :()=> ()=>Item){
            this.name = name ;
            this.description = description ;
            this.creator = creator ;
    }
}

export const itemCreators =  [
    new ItemCreator("計算","数字や文字を変数に代入します",useCalcSymCreator),
    new ItemCreator("繰り返し1","条件が成り立つ間繰り返します",useWhileSymCreator),
    new ItemCreator("繰り返し2","ループ用変数を使って繰り返します",useForSymCreator),
    new ItemCreator("分岐1","条件のYesとNoで処理を分岐します",useDoubleBranchSymCreator),
    new ItemCreator("分岐2","式によって多分岐します",useSwitchSymCreator),
    new ItemCreator("データ","データを入出力します",useDataSymCreator),
    new ItemCreator("準備","配列などを準備します",usePrepareSymCreator),
    new ItemCreator("定義済み処理","別のフロー（関数）を実行します",useProcessSymCreator),
] ;




