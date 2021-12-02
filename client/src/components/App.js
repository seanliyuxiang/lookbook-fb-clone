import NavBar from './NavBar';
import {Route, Switch} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Signup from './Signup';
import HomeFeed from './HomeFeed';
import UserProfile from './UserProfile';

function App() {
  const [user, setUser] = useState(null);

  // if no user is logged in
  if (!user) {
    return (
      <div>
        <NavBar user={user} setUser={setUser} />
        <Switch>
          <Route exact path='/'>
            <Signup setUser={setUser} />
          </Route>
        </Switch>
      </div>
    );
  }

  // if an user is logged in
  return (
    <div>
      <NavBar user={user} setUser={setUser} />
      <Switch>
        <Route exact path='/home'>
          <HomeFeed />
        </Route>
        <Route exact path='/me'>
          <UserProfile />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
