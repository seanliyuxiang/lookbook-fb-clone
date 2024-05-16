import Login from './Login';
import {Link, useHistory} from 'react-router-dom';
import SearchLookbook from './SearchLookbook';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';

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
        <nav className='header-nav-logged-out'>
          <h1 className='header-logo-logged-out'>
            <Link exact to='/'>
              l👀kbook
            </Link>
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
          <Link exact to='/home_feed'>
            l👀kbook
          </Link>
        </h1>
        <SearchLookbook />
        <ul className='header-list'>
          <li>
            <Link exact to={`/users/${user.id}`}>
              {user.first_name}
            </Link>
          </li>
          <li><button><NotificationsIcon />Notifications</button></li>
          <li><button onClick={logoutHandler}><LogoutIcon />Logout</button></li>
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;