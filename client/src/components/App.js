import NavBar from './NavBar';
import {Route, Switch} from 'react-router-dom';
import {useState} from 'react';
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
        <Route exact path='/home_feed'>
          <HomeFeed user={user} />
        </Route>
        <Route exact path='/users/:id'>
          <UserProfile user={user} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
