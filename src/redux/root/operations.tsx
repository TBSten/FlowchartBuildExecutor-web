import { useSelector } from "react-redux";
import { StoreState } from "../store";

export function useAppSelector<R>(selector: (state: StoreState) => R) {
    const ans = useSelector(selector)
    return ans;
}

