import { useChange, useSelectMode } from "src/redux/app/operations";
import { useHotkeys } from "react-hotkeys-hook";
import { saveToBrowser } from "src/format";
import { KeyboardEventHandler, useEffect } from "react";


const KeyboardHotKeys = () => {
    const { resetChangeCount } = useChange();
    useHotkeys("ctrl+s", (e) => {
        e.preventDefault();
        saveToBrowser();
        resetChangeCount();
    });
    useHotkeys("command+s", (e) => {
        e.preventDefault();
        saveToBrowser();
        resetChangeCount();
    });

    return (
        <></>
    );
};
export default KeyboardHotKeys;





