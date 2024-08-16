import {useState} from 'react';
import Login from './Login';
import {Link, useHistory} from 'react-router-dom';
import SearchLookbook from './SearchLookbook';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NavBarNotificationList from './NavBarNotificationList';
import LogoutIcon from '@mui/icons-material/Logout';

function NavBar({user, setUser}) {

  const [isNavBarNotificationListOpen, setIsNavBarNotificationListOpen] = useState(false);

  const history = useHistory();

  function toggleNavBarNotificationListHandler() {
    setIsNavBarNotificationListOpen(!isNavBarNotificationListOpen);
  }

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

  const passiveFriendshipsPending = user.passive_friendships.filter(
    passiveFriendship => passiveFriendship.status.toLowerCase() === 'pending'
  );

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
          <li>
            <button onClick={toggleNavBarNotificationListHandler}>
              {passiveFriendshipsPending.length > 0
                ? <NotificationsActiveIcon sx={{color: 'rgb(230, 31, 56)'}} />
                : <NotificationsIcon />
              }
              Notifications
            </button>
            {isNavBarNotificationListOpen &&
              <NavBarNotificationList
                user={user}
                setUser={setUser}
              />
            }
          </li>
          <li><button onClick={logoutHandler}><LogoutIcon />Logout</button></li>
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;