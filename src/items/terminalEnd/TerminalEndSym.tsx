
import BaseSymComponent, { SymChild } from "../base/SymBase";
import { render } from "../terminalStart/TerminalStartSym";

export const Child: SymChild = ({ sym }) => {
    const isReturnValue = !!sym.options[0].value;
    return <div> {isReturnValue ? sym.options[1].value + " を返す" : "おわり"} </div>;
};

const TerminalEndSym = BaseSymComponent(Child, render);

export default TerminalEndSym;

