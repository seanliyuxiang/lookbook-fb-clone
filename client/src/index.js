import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {BrowserRouter} from 'react-router-dom';

import './styles/my_reset.css';
// import './styles/index.css';
import './styles/NavBar.css';
import './styles/layout.css';
import './styles/Footer.css';
import './styles/cover_photo.css';
import './styles/sidebar.css';
import './styles/thumbs.css';
import './styles/FormToSubmitPost.css';
import './styles/posts.css';
import './styles/comments.css';
import './styles/FormToSubmitComment.css';
import './styles/HomeFeed.css';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
