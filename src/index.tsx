import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { RecoilRoot } from "recoil";
import "src/style/global.css";
import App from './App';
import { store } from './redux/store';


ReactDOM.render(
  <RecoilRoot>
    <React.StrictMode>
      <DndProvider backend={HTML5Backend}>
        <CssBaseline />
        <Provider store={store}>
          <App />
        </Provider>
      </DndProvider>
    </React.StrictMode>
  </RecoilRoot>,
  document.getElementById('root')
);
