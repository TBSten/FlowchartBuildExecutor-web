import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './redux/store';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import "src/style/global.css" ;

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <CssBaseline />
      <Provider store={store}>
        <App />
      </Provider>
    </DndProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
