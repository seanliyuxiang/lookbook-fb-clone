import Login from './Login';
import {NavLink} from 'react-router-dom';

function NavBar({user, setUser}) {

  // logout
  function logoutHandler() {
    fetch('/api/logout', {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        setUser(null);
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
      <NavLink exact to='/home' id='nav-bar-logo'>
        l👀kbook
      </NavLink>
      <NavLink exact to='/me'>
        {user.first_name}
      </NavLink>
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
}

export default NavBar;