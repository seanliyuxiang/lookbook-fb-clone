import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {BrowserRouter} from 'react-router-dom';

import './styles/my_reset.css';
// import './styles/index.css';
import './styles/NavBar.css';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
