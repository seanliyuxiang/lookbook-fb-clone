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
      <header className='header'>
        <nav className='header-nav'>
          <h1 className='header-logo'>
            <NavLink exact to='/'>
              l👀kbook
            </NavLink>
          </h1>
          <Login setUser={setUser} />
        </nav>
      </header>
    );
  }

  // if an user is logged in
  return (
    <header className='header'>
      <nav className='header-nav'>
        <h1 className='header-logo'>
          <NavLink exact to='/home_feed'>
            l👀kbook
          </NavLink>
        </h1>
        <SearchLookbook />
        <ul className='header-list'>
          <li>
            <NavLink exact to={`/users/${user.id}`}>
              {user.first_name}
            </NavLink>
          </li>
          <li>Notifications</li>
          <li><button onClick={logoutHandler}>Logout</button></li>
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;