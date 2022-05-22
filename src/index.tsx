import CssBaseline from '@mui/material/CssBaseline';
import React, { FC } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from "recoil";
import Error from "src/components/util/Error";
import "src/style/global.css";
import App from './App';
import Preview from './Preview';
import { store } from './redux/store';
import Reset from './Reset';


const CoreApp: FC<{}> = () => {
  return (
    <App />
  );
}

export default CoreApp;

ReactDOM.render(
  <>
    <RecoilRoot>
      <React.StrictMode>
        <DndProvider backend={HTML5Backend}>
          <Provider store={store}>
            <CssBaseline />
            <Error>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<CoreApp />} />
                  <Route path="reset" element={<Reset />} />
                  <Route path="preview" element={<Preview />} />
                </Routes>
              </BrowserRouter>
            </Error>
          </Provider>
        </DndProvider>
      </React.StrictMode>
    </RecoilRoot>
  </>
  ,
  document.getElementById('root')
);


