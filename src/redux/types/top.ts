import { VariableValue } from "exe/runtimes/types";

export interface ArrayTemplate{
    name :string;
    value :VariableValue;
} ;

export type ArrayTemplates = ArrayTemplate[] ;
