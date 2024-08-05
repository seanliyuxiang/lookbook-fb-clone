import {useMemo} from 'react';
import {Link} from 'react-router-dom';

function NavBarNotificationList({user, setUser}) {

  const receivedFriendshipsPending = useMemo(() => {
    return (
      user.passive_friendships.filter(passiveFriendship =>
        passiveFriendship.status.toLowerCase() === 'pending'
      )
    );
  }, [user]);

  function confirmFriendshipHandler(friendshipID) {
    return (
      function() {
        fetch(`/api/friendships/${friendshipID}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'confirmed'
          })
        })
        .then(response => {
          if (response.ok) {
            response.json().then(friendship =>
              setUser({
                ...user,
                passive_friendships: user.passive_friendships.map(passiveFriendship => {
                  if (passiveFriendship.id === friendship.id) {
                    return friendship; // replace with the updated friendship
                  } else {
                    return passiveFriendship;
                  }
                })
              })
            );
          }
        });
      }
    );
  }

  function deleteFriendshipHandler(friendshipID) {
    return (
      function() {
        fetch(`/api/friendships/${friendshipID}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (response.ok) {
            response.json().then(friendship =>
              setUser({
                ...user,
                passive_friendships: user.passive_friendships.filter(passiveFriendship => {
                  return (passiveFriendship.id !== friendship.id); // filter out the deleted friendship
                })
              })
            );
          }
        });
      }
    );
  }

  return (
    <ul className='header-notifications'>
      {receivedFriendshipsPending.length > 0
        ? receivedFriendshipsPending.map(friendship => {
          return (
            <li key={friendship.id}>
              <p>
                <Link to={`/users/${friendship.user.id}`}>
                  {`${friendship.user.first_name} ${friendship.user.last_name}`}
                </Link>
                {' sent you a friend request'}
              </p>
              <div className='header-notification-list-item-tools'>
                <button onClick={confirmFriendshipHandler(friendship.id)}>
                  Confirm
                </button>
                <button onClick={deleteFriendshipHandler(friendship.id)}>
                  Delete
                </button>
              </div>
            </li>
          );
        })
        : <li>
          <p>No pending friend requests</p>
        </li>
      }
    </ul>
  );
}

export default NavBarNotificationList;