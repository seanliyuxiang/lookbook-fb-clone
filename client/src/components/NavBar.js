import Login from './Login';
import {NavLink, useHistory} from 'react-router-dom';
import SearchLookbook from './SearchLookbook';

function NavBar({user, setUser}) {

  const history = useHistory();

  // logout
  function logoutHandler() {
    fetch('/api/logout', {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        setUser(null);
        history.push('/');  // automatically go to login/signup page after logout
      }
    });
  }

  // if no user is logged in
  if (!user) {
    return (
      <div id='nav-bar'>
        <NavLink exact to='/' id='nav-bar-logo'>
          l👀kbook
        </NavLink>
        <Login setUser={setUser} />
      </div>
    );
  }

  // if an user is logged in
  return (
    <div id='nav-bar'>
      <NavLink exact to='/home_feed' id='nav-bar-logo'>
        l👀kbook
      </NavLink>
      <SearchLookbook />
      <NavLink exact to={`/users/${user.id}`}>
        {user.first_name}
      </NavLink>
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
}

export default NavBar;