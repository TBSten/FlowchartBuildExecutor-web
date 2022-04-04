import { useHotkeys } from "react-hotkeys-hook";
import { saveToBrowser } from "src/format/browser";
import { useChange } from "src/redux/app/hooks";


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





