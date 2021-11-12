import { useState, } from "react" ;

import { downloadTextFile, getSaveState, inputTextFile, loadBrowserSaveData, loadSaveState, saveBrowserSaveData, } from "util/io" ;
import { useAppDialog } from "redux/reducers/app" ;
import { declutterItems } from "util/io" ;
import { test } from "util/html2Image" ;

export default function TestZone(){
    //console.log("test ###################");
    const [show,setShow] = useState(true);
    const [file, setFile] = useState("");
    const dialog = useAppDialog();
    //console.log(dialog);
    async function inputFile(){
        const value = await inputTextFile();
        alert("load !");
        loadSaveState(JSON.parse(value));
    }
    function downloadFile(){
        const data = JSON.stringify(getSaveState()) ;
        const fName = window.prompt("File name","Test_file.txt");
        if(fName){
            downloadTextFile(fName,data);
        }
    }
    function loadBS(){
        loadBrowserSaveData();
    }
    function saveBS(){
        saveBrowserSaveData();
    }
    const ans = (
        <div style={{border:"solid 1px black", position:"absolute", left:"3px", bottom:"3px",background:"rgba(255,255,255,0.8)",zIndex:99999, padding:show?"1rem":"0px",}}>
            {
                show?
                <>
                    <hr/>
                    <h1>TEST ZONE</h1>
                    <button onClick={downloadFile}>DOWNLOAD FILE</button>
                    <hr/>
                    {file}
                    <button onClick={inputFile}>FILE INPUT</button>
                    <hr/>
                    <button onClick={saveBS}>save</button>
                    <button onClick={loadBS}>load</button>
                    <hr/>
                    <button onClick={()=>dialog.show("OK")}>open app dialog</button>
                    <button onClick={()=>dialog.hide()}>hide app dialog</button>
                    <hr/>
                    <button onClick={()=>test()}>buildPane {"->"} image</button>
                    <hr/>
                    {/* <button onClick={()=>{declutterItems()}}>declutterItems</button> */}
                </>
                :""
            }
            <div>
                <button onClick={()=>{setShow(prev=>!prev)}}>
                    {show?"CLOSE":"SHOW"}
                </button>
            </div>
        </div>
    ) ;
    //console.log("########################");
    return ans ;
}

