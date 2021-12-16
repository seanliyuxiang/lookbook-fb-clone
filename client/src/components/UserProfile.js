import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import Post from './Post';

function UserProfile({user}) {

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

  /*
  need to make a copy of the user's posts first,
  then reverse the order of that copied array,
  so that the user's posts are from the newest to the oldest
  */
  const arbitraryUsersPostsArrJSX = [...arbitraryUser.posts].reverse().map(
    arbitraryUsersPost => {
      return (
        <Post key={arbitraryUsersPost.id} post={arbitraryUsersPost} user={user} />
      );
    }
  );

  return (
    <div>
      <h1>coming from UserProfile.js</h1>
      <h1>User profile: {`${arbitraryUser.first_name} ${arbitraryUser.last_name}`}</h1>
      <h1>{arbitraryUser.email}</h1>
      {arbitraryUsersPostsArrJSX}
    </div>
  );
}

export default UserProfile;