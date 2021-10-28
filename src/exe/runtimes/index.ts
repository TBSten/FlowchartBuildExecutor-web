import Runtime from "./Runtime" ;
import MsgBoxRuntime from "./MsgBoxRuntime";
import TerminalRuntime from "./TerminalRuntime";


export const runtimes :(typeof Runtime)[] = [
    MsgBoxRuntime,
    TerminalRuntime,
] ;

