import NavBar from './NavBar';
import {Route, Switch} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Signup from './Signup';
import HomeFeed from './HomeFeed';
import UserProfile from './UserProfile';
import Footer from './Footer';

function App() {
  const [user, setUser] = useState(null);

  // auto-login
  useEffect(() => {
    fetch('/api/auto_login')
    .then(response => {
      if (response.ok) {
        response.json().then(jsonData => setUser(jsonData));
      }
    });
  }, []);

  // if no user is logged in
  if (!user) {
    return (
      <>
        <NavBar user={user} setUser={setUser} />
        <Switch>
          <Route exact path='/'>
            <Signup setUser={setUser} />
          </Route>
        </Switch>
        <Footer user={user} />
      </>
    );
  }

  // if an user is logged in
  return (
    <>
      <NavBar user={user} setUser={setUser} />
      <Switch>
        <Route exact path='/'>
          <HomeFeed user={user} />
        </Route>
        <Route exact path='/home_feed'>
          <HomeFeed user={user} />
        </Route>
        <Route exact path='/users/:id'>
          <UserProfile user={user} setUser={setUser} />
        </Route>
      </Switch>
      <Footer user={user} />
    </>
  );
}

export default App;
