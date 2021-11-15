import Runtime from "./Runtime" ;
import MsgBoxRuntime from "./MsgBoxRuntime";
import TerminalRuntime from "./TerminalRuntime";
import TableRuntime from "./TableRuntime";


export const runtimes :(typeof Runtime)[] = [
    MsgBoxRuntime,
    TerminalRuntime,
    TableRuntime,
] ;

