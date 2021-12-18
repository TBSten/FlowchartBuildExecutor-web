
import "./css/global.min.css" ;
import MuiPaper from "@material-ui/core/Paper" ;
import {sp, } from "./css/media" ;
import { useEffect, useRef, useState } from "react";
// import {useDispatch} from "react-redux";
import BuildPane from "./BuildPane";

import Head from "components/App/Head";
import SideBar from "components/App/SideBar";
import styled from "styled-components" ;
import FabBar from "components/App/FabBar" ;
import AppDialog from "components/App/AppDialog" ;
import AppSnackBar from "components/App/AppSnackBar" ;
// import TestZone from "components/App/TestZone";

// import {test} from "util/formulaEval" ;
import { loadBrowserSaveData, saveBrowserSaveData } from "util/io";
import { useIsLoading } from "redux/reducers/app";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { setMode } from "redux/reducers/mode";
import { useDispatch } from "react-redux";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr ;
  gap:5px;
  overflow: auto;
  ${sp`
    grid-template-columns: 1fr;
    grid-template-rows: auto 5fr 5fr;
  `}
`;
const TopContainer = styled.div`
  grid-column: 1 / 3;
  grid-row : 1 / 2;
`;
const MainContainer = styled(MuiPaper)`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  width: 100%;
  height: 100%;
  overflow:auto;
  background: #f5f5f5;
  ${sp`
    grid-column: 1 / 3;
  `}
`;


function App() {
  console.log("########## App render ##########");
  const ref = useRef<HTMLDivElement>(null!);
  const {
    isLoading,
    startLoad,
    finishLoad } = useIsLoading();
  const dispatch = useDispatch() ;

  useEffect(()=>{
      console.log(ref);
      if(ref.current){
          ref.current.scrollTop = 90 ;
          ref.current.scrollLeft = 90 ;
      }
  },[]);

  useEffect(()=>{
    //セーブデータのロード
    const start = new Date() ;
    startLoad();
    loadBrowserSaveData();
    //ロード中オフ
    console.log("loaded save data from browser in "+
      (new Date().getTime()-start.getTime())+"ms")
    finishLoad();

    //オートセーブ
    const tid = setInterval(()=>{
      //save
      console.log("auto save start");
      saveBrowserSaveData();
      // console.log("auto save end");
    },30*1000);

    return ()=>{
      clearInterval(tid);
    } ;
  },[]);

  const [showSideBar,setShowSideBar] = useState(true) ;

  return (
    isLoading?
    <Backdrop open={isLoading}>
      <CircularProgress/>
    </Backdrop>
    :
    <AppContainer>
      <TopContainer>
        {/* <button onClick={()=>{dispatch(actionCreators.addItem(calcSymCreator()))}}>BUTTON</button> */}
        <Head 
          isShowSideBar={showSideBar}
          toggleSideBar={()=>setShowSideBar(prev=>!prev)}/>
      </TopContainer>
      <MainContainer ref={ref}>
        <BuildPane />
      </MainContainer>
      <SideBar 
        show={showSideBar} 
        showSideBar={()=>{setShowSideBar(true)}} 
        hideSideBar={()=>setShowSideBar(false)}/>

      <FabBar />

      {/* <TestZone/> */}
      
      <AppDialog/>

      <AppSnackBar />

    </AppContainer>
    
  );
}


export default App;


