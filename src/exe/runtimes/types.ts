import {Lt} from "util/formulaEval" ;

//Variable types
export type BaseType = 
  Lt ;
export type ArrayBaseType = 
  Lt ;
export type VariableValue =
  Lt ;
export class Variable {
  name: string;
  value: VariableValue;
  constructor(name: string, value: VariableValue) {
    this.name = name;
    this.value = value;
  }
}


