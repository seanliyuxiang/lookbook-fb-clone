import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import Post from './Post';
import FormToSubmitPost from './FormToSubmitPost';

function UserProfile({user, setUser}) {

  const [arbitraryUser, setArbitraryUser] = useState(null);
  const params = useParams();

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
    .then(response => response.json())
    .then(user => setArbitraryUser(user));

    // scroll to top of user's page after user's name is clicked
    window.scrollTo(0, 0);
  }, [params.id]);

  // need this if-statement for `TypeError: Cannot read properties of null`
  if (!arbitraryUser) {
    return <h1>Loading...</h1>;
  }

  function setArbitraryUserWrapperToRemoveWallPost(deletedWallPost) {
    setArbitraryUser({
      ...arbitraryUser,
      wall_posts: arbitraryUser.wall_posts.filter(wallPost => wallPost.id !== deletedWallPost.id) // filter out the deleted wall post
    });
  }

  function setArbitraryUserWrapperToUpdateWallPost(updatedWallPost) {
    setArbitraryUser({
      ...arbitraryUser,
      wall_posts: arbitraryUser.wall_posts.map(wallPost => {
        if (wallPost.id === updatedWallPost.id) {
          return updatedWallPost; // replace with the updated wall post
        } else {
          return wallPost;
        }
      })
    });
  }

  /*
  need to make a copy of the user's wall posts first,
  then reverse the order of that copied array,
  so that the user's wall posts are from the newest to the oldest
  */
  const arbitraryUsersWallPostsArrJSX = [...arbitraryUser.wall_posts].reverse().map(
    arbitraryUsersWallPost => {
      return (
        <Post
          key={arbitraryUsersWallPost.id}
          post={arbitraryUsersWallPost}
          user={user}
          setArbitraryUserWrapperToRemoveWallPost={setArbitraryUserWrapperToRemoveWallPost}
          setArbitraryUserWrapperToUpdateWallPost={setArbitraryUserWrapperToUpdateWallPost}
        />
      );
    }
  );

  function setArbitraryUserWrapperToAddNewWallPost(newWallPost) {
    setArbitraryUser({
      ...arbitraryUser,
      wall_posts: [
        ...arbitraryUser.wall_posts,
        newWallPost // add the newly submitted wall post
      ]
    });
  }

  const arbitraryUsersFriendsArrJSX = arbitraryUser.assertive_friendships.map(
    assertiveFriendship => {
      return (
        <p key={assertiveFriendship.friend.id}>{`${assertiveFriendship.friend.first_name} ${assertiveFriendship.friend.last_name}`}</p>
      );
    }
  );

  function addFriendshipHandler() {
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
    .then(response => {
      if (response.ok) {
        response.json().then(newFriendship => setUser({
          ...user,
          assertive_friendships: [
            ...user.assertive_friendships,
            newFriendship // add the new friendship
          ]
        }));
      }
    });

    // if a friendship gets created for user and friend, then by default a friendship also gets created for friend and user
    fetch('/api/friendships', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: arbitraryUser.id,
        friend_id: user.id
      })
    })
    .then(response => {
      if (response.ok) {
        response.json().then(newFriendship => setArbitraryUser({
          ...arbitraryUser,
          assertive_friendships: [
            ...arbitraryUser.assertive_friendships,
            newFriendship // add the new friendship
          ]
        }));
      }
    });
  }

  function deleteFriendshipHandler() {
    let friendshipID1;
    for (let friendship of user.assertive_friendships) {
      if (friendship.user_id === user.id && friendship.friend_id === arbitraryUser.id) {
        friendshipID1 = friendship.id;
      }
    }

    fetch(`/api/friendships/${friendshipID1}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        response.json().then(deletedFriendship => setUser({
          ...user,
          assertive_friendships: user.assertive_friendships.filter(assertiveFriendship => assertiveFriendship.id !== deletedFriendship.id)
        }));
      }
    });

    // if a friendship gets deleted for user and friend, then by default a friendship also gets deleted for friend and user
    let friendshipID2;
    for (let friendship of arbitraryUser.assertive_friendships) {
      if (friendship.user_id === arbitraryUser.id && friendship.friend_id === user.id) {
        friendshipID2 = friendship.id;
      }
    }

    fetch(`/api/friendships/${friendshipID2}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        response.json().then(deletedFriendship => setArbitraryUser({
          ...arbitraryUser,
          assertive_friendships: arbitraryUser.assertive_friendships.filter(assertiveFriendship => assertiveFriendship.id !== deletedFriendship.id)
        }));
      }
    });
  }

  function submitProfilePictureHandler(event) {
    event.preventDefault();

    const profilePicture = new FormData();
    if (event.target.profile_picture.files.length > 0) {  // if there is file attached
      profilePicture.append('profile_picture', event.target.profile_picture.files[0], event.target.profile_picture.value);
    }

    fetch(`/api/users/${arbitraryUser.id}/attach_new_profile_picture`, {
      method: 'POST',
      body: profilePicture
    })
    .then(response => response.json())
    .then(user => setArbitraryUser(user));
  }

  return (
    <div>
      <h1>coming from UserProfile.js</h1>
      {arbitraryUser.id === user.id ?
        <button>Add Cover Photo</button>
      : (user.assertive_friendships.map(assertiveFriendship => assertiveFriendship.friend.id).includes(arbitraryUser.id) ? <button onClick={deleteFriendshipHandler}>Friends</button> : <button onClick={addFriendshipHandler}>Add Friend</button>)}  {/* ternary within a ternary */}
      <h1>User profile: {`${arbitraryUser.first_name} ${arbitraryUser.last_name}`}</h1>
      <h1>{arbitraryUser.email}</h1>
      <img
        src={!arbitraryUser.profile_picture_url ? 'https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png' : arbitraryUser.profile_picture_url}
        alt=''
      />
      {arbitraryUser.id === user.id ?
        <form onSubmit={submitProfilePictureHandler}>
          <input type='file' name='profile_picture' />
          <button>Update Profile Picture</button>
        </form>
      : null}
      <FormToSubmitPost user={user} setArbitraryUserWrapperToAddNewWallPost={setArbitraryUserWrapperToAddNewWallPost} arbitraryUser={arbitraryUser} />
      {arbitraryUsersWallPostsArrJSX}
      <div>
        <p>Friends</p>
        {arbitraryUsersFriendsArrJSX}
      </div>
    </div>
  );
}

export default UserProfile;