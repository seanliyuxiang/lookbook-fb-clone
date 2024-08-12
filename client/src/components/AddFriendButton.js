import {useState, useMemo} from 'react';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ErrorIcon from '@mui/icons-material/Error';

/**
 * Function that finds the pending friendship id which logged-in user received friendship request from arbitrary user
 * @param {{ [key: string]: number | string | {}; }[]} passiveFriendships 
 * @param {number} arbitraryUserID 
 * @returns 
 */
function findPendingPassiveFriendshipID(passiveFriendships, arbitraryUserID) {
  for (const onePassiveFriendship of passiveFriendships) {
    if (onePassiveFriendship.user.id === arbitraryUserID) {
      return onePassiveFriendship.id;
    }
  }

  return undefined;
}

/**
 * Function that finds the pending friendship id which logged-in user sent friendship request to arbitrary user
 * @param {{ [key: string]: number | string | {}; }[]} assertiveFriendships 
 * @param {number} arbitraryUserID 
 * @returns 
 */
function findPendingAssertiveFriendshipID(assertiveFriendships, arbitraryUserID) {
  for (const oneAssertiveFriendship of assertiveFriendships) {
    if (oneAssertiveFriendship.friend.id === arbitraryUserID) {
      return oneAssertiveFriendship.id;
    }
  }

  return undefined;
}

/**
 * Function that finds the confirmed friendship id which logged-in user either 
 * sent friendship request to or received friendship request from arbitrary user
 * @param {{ [key: string]: number | string | {}; }[]} assertiveFriendships 
 * @param {{ [key: string]: number | string | {}; }[]} passiveFriendships 
 * @param {number} arbitraryUserID 
 * @returns 
 */
function findConfirmedFriendshipID(assertiveFriendships, passiveFriendships, arbitraryUserID) {
  for (const oneAssertiveFriendship of assertiveFriendships) {
    if (oneAssertiveFriendship.friend.id === arbitraryUserID) {
      return oneAssertiveFriendship.id;
    }
  }

  for (const onePassiveFriendship of passiveFriendships) {
    if (onePassiveFriendship.user.id === arbitraryUserID) {
      return onePassiveFriendship.id;
    }
  }

  return undefined;
}

function AddFriendButton({user, setUser, arbitraryUser}) {

  const [isButtonMenuOpen, setIsButtonMenuOpen] = useState(false);

  // user ids of pending friendships (i.e. passive_friendships) that logged-in user received
  const userIDsFromPendingPassiveFriendshipsThatLoggedInUserReceived = useMemo(() => {
    return user.passive_friendships.filter(
      passiveFriendship => passiveFriendship.status.toLowerCase() === 'pending'
    ).map(
      passiveFriendship => passiveFriendship.user.id
    );
  }, [user]);

  // friend ids of pending friendships (i.e. assertive_friendships) that logged-in user sent
  const friendIDsFromPendingAssertiveFriendshipsThatLoggedInUserSent = useMemo(() => {
    return user.assertive_friendships.filter(
      assertiveFriendship => assertiveFriendship.status.toLowerCase() === 'pending'
    ).map(
      assertiveFriendship => assertiveFriendship.friend.id
    );
  }, [user]);

  // confirmed friendships could be in both assertive_friendships and passive_friendships of logged-in user
  const userIDsAndFriendIDsFromConfirmedFriendshipsOfLoggedInUser = useMemo(() => {
    const friendIDsFromConfirmedAssertiveFriendships = user.assertive_friendships.filter(
      assertiveFriendship => assertiveFriendship.status.toLowerCase() === 'confirmed'
    ).map(
      assertiveFriendship => assertiveFriendship.friend.id
    );

    const userIDsFromConfirmedPassiveFriendships = user.passive_friendships.filter(
      passiveFriendship => passiveFriendship.status.toLowerCase() === 'confirmed'
    ).map(
      passiveFriendship => passiveFriendship.user.id
    );

    return friendIDsFromConfirmedAssertiveFriendships.concat(userIDsFromConfirmedPassiveFriendships);
  }, [user]);

  function toggleButtonMenuOpenHandler() {
    setIsButtonMenuOpen(!isButtonMenuOpen);
  }

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
                  return (passiveFriendship.id !== friendship.id); // filter out the deleted friendship if it is in passive_friendships
                }),
                assertive_friendships: user.assertive_friendships.filter(assertiveFriendship => {
                  return (assertiveFriendship.id !== friendship.id); // filter out the deleted friendship if it is in assertive_friendships
                })
              })
            );
          }
        });
      }
    );
  }

  function createFriendshipHandler() {
    fetch('/api/friendships', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user.id,
        friend_id: arbitraryUser.id
      })
    })
    .then(response => response.json())
    .then(friendship =>
      setUser({
        ...user,
        assertive_friendships: [
          ...user.assertive_friendships,
          friendship // add the newly created friendship
        ]
      })
    );
  }

  if (userIDsFromPendingPassiveFriendshipsThatLoggedInUserReceived.includes(arbitraryUser.id)) {
    // if the currently displayed user is whom the logged-in user already received friendship request from
    return (
      <div className='content-header-btn-dropdown'>
        <button
          className='content-header-btn position-static'
          onClick={toggleButtonMenuOpenHandler}
        >
          <PersonAddAltIcon />
          Respond
        </button>
        {isButtonMenuOpen &&
          <ul className='content-header-btn-dropdown-list'>
            <li>
              <button onClick={confirmFriendshipHandler(findPendingPassiveFriendshipID(user.passive_friendships, arbitraryUser.id))}>
                <CheckIcon />
                Confirm request
              </button>
            </li>
            <li>
              <button onClick={deleteFriendshipHandler(findPendingPassiveFriendshipID(user.passive_friendships, arbitraryUser.id))}>
                <DeleteIcon />
                Delete request
              </button>
            </li>
          </ul>
        }
      </div>
    );
  } else if (friendIDsFromPendingAssertiveFriendshipsThatLoggedInUserSent.includes(arbitraryUser.id)) {
    // else if the currently displayed user is whom the logged-in user already sent friendship request to
    return (
      <button
        className='content-header-btn'
        onClick={deleteFriendshipHandler(findPendingAssertiveFriendshipID(user.assertive_friendships, arbitraryUser.id))}
      >
        <CancelIcon />
        Cancel request
      </button>
    );
  } else if (userIDsAndFriendIDsFromConfirmedFriendshipsOfLoggedInUser.includes(arbitraryUser.id)) {
    // else if the currently displayed user is friends with the logged-in user
    return (
      <div className='content-header-btn-dropdown'>
        <button
          className='content-header-btn position-static'
          onClick={toggleButtonMenuOpenHandler}
        >
          <PeopleAltIcon />
          Friends
        </button>
        {isButtonMenuOpen &&
          <ul className='content-header-btn-dropdown-list'>
            <li>
              <button onClick={deleteFriendshipHandler(findConfirmedFriendshipID(user.assertive_friendships, user.passive_friendships, arbitraryUser.id))}>
                <PersonRemoveIcon />
                Unfriend
              </button>
            </li>
          </ul>
        }
      </div>
    );
  } else if (
    !userIDsFromPendingPassiveFriendshipsThatLoggedInUserReceived.includes(arbitraryUser.id) &&
    !friendIDsFromPendingAssertiveFriendshipsThatLoggedInUserSent.includes(arbitraryUser.id) &&
    !userIDsAndFriendIDsFromConfirmedFriendshipsOfLoggedInUser.includes(arbitraryUser.id)
  ) {
    // else if the currently displayed user is NOT friends with the logged-in user
    return (
      <button
        className='content-header-btn'
        onClick={createFriendshipHandler}
      >
        <PersonAddAlt1Icon />
        Add friend
      </button>
    );
  } else {
    return (
      <button className='content-header-btn'>
        <ErrorIcon />
        Error
      </button>
    );
  }
}

export default AddFriendButton;