
import "./css/global.min.css" ;
import MuiPaper from "@material-ui/core/Paper" ;
import {sp, } from "./css/media" ;
import { useEffect, useRef,   } from "react";
import BuildPane from "./BuildPane";
import Head from "components/App/Head";
import SideBar from "components/App/SideBar";
import styled from "styled-components" ;
// import { useInputs } from "util/hooks";
import {useItems} from "redux/reducers/items" ;
import {useTopFlows} from "redux/reducers/top" ;
import { useMultiSelect } from "redux/reducers/selectItem";
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
    grid-template-rows: auto 3fr auto;
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
const SideContainer = styled(MuiPaper)`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  width: 100%;
  height: 100%;
  overflow:auto;
  /* border: solid 1px gray;
  border-radius: 10px ; */
  box-sizing:border-box;
  z-index: 1;

  ${sp`
    grid-column: 1 / 3;
    grid-row: 3 / 4;
  `}
`;

// const MainContainer = styled.div`
//   display: flex;

//   flex-grow: 1;
// `;


function App() {
  // console.log("########## App render ##########");

  const ref = useRef<HTMLDivElement>(null!);
  useEffect(()=>{
      console.log(ref);
      if(ref.current){
          ref.current.scrollTop = 90 ;
          ref.current.scrollLeft = 90 ;
      }
  },[]);

  const items = useItems() ;
  const topFlows = useTopFlows() ;
  console.log(items, topFlows);

  return (
    <AppContainer>
      <TopContainer>
        {/* <button onClick={()=>{dispatch(actionCreators.addItem(calcSymCreator()))}}>BUTTON</button> */}
        <Head />
      </TopContainer>
      <MainContainer ref={ref}>
        <BuildPane />
      </MainContainer>
      <SideContainer>
        <SideBar />
      </SideContainer>
    </AppContainer>
    
  );
}


export default App;


