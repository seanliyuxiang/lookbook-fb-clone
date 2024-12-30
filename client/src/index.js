import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {BrowserRouter} from 'react-router-dom';

import './styles/my_reset.css';
// import './styles/index.css';
import './styles/NavBar.css';
import './styles/Login.css';
import './styles/Signup.css';
import './styles/layout.css';
import './styles/Footer.css';
import './styles/cover_photo.css';
import './styles/sidebar.css';
import './styles/thumbs.css';
import './styles/FormToSubmitPost.css';
import './styles/posts.css';
import './styles/FormToEditPost.css';
import './styles/comments.css';
import './styles/FormToEditComment.css';
import './styles/FormToSubmitComment.css';
import './styles/HomeFeed.css';
import './styles/SearchLookbook.css';
import './styles/SearchResultsContainer.css';
import './styles/NavBarNotificationList.css';
import './styles/ValidationErrorMessage.css';
import './styles/Card.css';
import './styles/TryPosting.css';
import './styles/TrySearching.css';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
