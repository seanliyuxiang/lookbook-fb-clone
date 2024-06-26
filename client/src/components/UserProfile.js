import {useState, useEffect, useRef} from 'react';
import {useParams, Link} from 'react-router-dom';
import Post from './Post';
import FormToSubmitPost from './FormToSubmitPost';
import blankCoverPhoto from '../images/blank_cover_photo.png';
import blankProfilePicture from '../images/blank_profile_picture.png';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SmsIcon from '@mui/icons-material/Sms';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GroupsIcon from '@mui/icons-material/Groups';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

function UserProfile({user, setUser}) {

  const [arbitraryUser, setArbitraryUser] = useState(null);
  const params = useParams();

  const coverPhotoFileInputRef = useRef(null);
  const profilePictureFileInputRef = useRef(null);

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
    .then(response => response.json())
    .then(user => setArbitraryUser(user));

    // scroll to top of user's page after user's name is clicked
    window.scrollTo(0, 0);
  }, [params.id]);

  // need this if-statement for `TypeError: Cannot read properties of null`
  if (!arbitraryUser) {
    return (
      <main className='content'>
        <section className='content-main' style={{margin: '0 auto', textAlign: 'center'}}>
          Loading...
        </section>
      </main>
    );
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
        <li key={assertiveFriendship.friend.id}>
          <Link to={`/users/${assertiveFriendship.friend.id}`} title={assertiveFriendship.friend.first_name} className='thumb'>
            <img
              src={!assertiveFriendship.friend.profile_picture_url ? blankProfilePicture : assertiveFriendship.friend.profile_picture_url}
              alt=''
            />
          </Link>
        </li>
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

  function changeCoverPhotoFileInputHandler(event) {
    /*
    when calling the `.append` method,
    don't nest the key under `user` because strong params is not required in the backend
    */
    const coverPhoto = new FormData();
    coverPhoto.append('cover_photo', event.target.files[0], event.target.value);

    fetch(`/api/users/${arbitraryUser.id}/attach_new_cover_photo`, {
      method: 'POST',
      body: coverPhoto
    })
    .then(response => response.json())
    .then(user => {
      setArbitraryUser(user);
      setUser(user);
    });
  }

  function openCoverPhotoFilePickerHandler() {
    // using `click()` method to open the file picker of hidden file input element
    // could possibly be refactored together with `openProfilePictureFilePickerHandler` function to be more DRY
    coverPhotoFileInputRef.current.click();
  }

  function changeProfilePictureFileInputHandler(event) {
    /*
    when calling the `.append` method,
    don't nest the key under `user` because strong params is not required in the backend
    */
    const profilePicture = new FormData();
    profilePicture.append('profile_picture', event.target.files[0], event.target.value);

    fetch(`/api/users/${arbitraryUser.id}/attach_new_profile_picture`, {
      method: 'POST',
      body: profilePicture
    })
    .then(response => response.json())
    .then(user => {
      setArbitraryUser(user);
      setUser(user);
    });
  }

  function openProfilePictureFilePickerHandler() {
    // using `click()` method to open the file picker of hidden file input element
    // could possibly be refactored together with `openCoverPhotoFilePickerHandler` function to be more DRY
    profilePictureFileInputRef.current.click();
  }

  return (
    <main className='content'>
      <header className='content-header' style={{ backgroundImage: `url(${!arbitraryUser.cover_photo_url ? blankCoverPhoto : arbitraryUser.cover_photo_url})`}}>
        <h1>{`${arbitraryUser.first_name} ${arbitraryUser.last_name}`}</h1>
        {arbitraryUser.id === user.id ?
          <>
            {/* file input is currently not set up as controlled form,
            need to change it in the future if want to have image preview */}
            <input
              ref={coverPhotoFileInputRef}
              type='file'
              name='cover_photo'
              onChange={changeCoverPhotoFileInputHandler}
            />
            <button
              className='content-header-btn'
              onClick={openCoverPhotoFilePickerHandler}
            >
              <PhotoCameraIcon />
              Add Cover Photo
            </button>
          </>
          : (user.assertive_friendships.map(assertiveFriendship => assertiveFriendship.friend.id).includes(arbitraryUser.id) ?
              <button
                onClick={deleteFriendshipHandler}
                className='content-header-btn'
              >
                <PeopleAltIcon />
                Friends
              </button>
            : <button
              onClick={addFriendshipHandler}
              className='content-header-btn'
            >
              <PersonAddIcon />
              Add Friend
            </button>
          )
        }  {/* ternary within a ternary */}
      </header>

      <section className='content-sidebar'>
        <div className='profile-picture'>
          <img
            src={!arbitraryUser.profile_picture_url ? blankProfilePicture : arbitraryUser.profile_picture_url}
            alt=''
          />
          {arbitraryUser.id === user.id &&
            <>
              {/* file input is currently not set up as controlled form,
              need to change it in the future if want to have image preview */}
              <input
                ref={profilePictureFileInputRef}
                type='file'
                name='profile_picture'
                onChange={changeProfilePictureFileInputHandler}
              />
              <button onClick={openProfilePictureFilePickerHandler}>
                <PhotoCameraIcon />
              </button>
            </>
          }
        </div>
        <div className='profile-info'>
          <h2>{arbitraryUser.first_name}</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <ul className='profile-nav'>
          <li><a href=''><SmsIcon />Wall</a></li>
          <li><a href=''><AccountBoxIcon />About</a></li>
          <li><a href=''><GroupsIcon />Friends</a></li>
          <li><a href=''><PhotoLibraryIcon />Photos</a></li>
        </ul>
        <ul className='profile-friends'>
          {arbitraryUsersFriendsArrJSX}
        </ul>
      </section>

      <section className='content-main'>
        {((arbitraryUser.id !== user.id) && (!arbitraryUser.assertive_friendships.map(assertiveFriendship => assertiveFriendship.friend_id).includes(user.id))) ?
          null
        : <FormToSubmitPost user={user} setArbitraryUserWrapperToAddNewWallPost={setArbitraryUserWrapperToAddNewWallPost} arbitraryUser={arbitraryUser} />}
        <div className='posts'>
          {arbitraryUsersWallPostsArrJSX}
        </div>
      </section>

    </main>
  );
}

export default UserProfile;