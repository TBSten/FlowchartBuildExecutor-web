//Variable types
export type BaseType = 
  string | boolean | number ;
export type ArrayBaseType = 
  BaseType | BaseType[] ;
export type VariableValue =
  ArrayBaseType | ArrayBaseType[] ;
export class Variable {
  name: string;
  value: VariableValue;
  constructor(name: string, value: VariableValue) {
    this.name = name;
    this.value = value;
  }
}


