
import { store } from "src/redux/store";
import { BranchBase } from "../if/IfSym";
import { SymComponent } from "../types";
import { getItem } from "src/redux/items/selectors";
import { isFlow } from "src/redux/items/types";
import ErrorView from "src/components/util/ErrorView";


const SwitchSym: SymComponent = BranchBase(
    (switchId, childId) => {
        const state = store.getState();
        const child = getItem(childId)(state);
        if (!isFlow(child)) return <ErrorView log={[child]} />;
        return child.tag;
    }
);

export default SwitchSym;

