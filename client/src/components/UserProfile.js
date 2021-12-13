import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import Post from './Post';

function UserProfile() {

  const [arbitraryUser, setArbitraryUser] = useState(null);
  const params = useParams();

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
    .then(response => response.json())
    .then(user => setArbitraryUser(user));
  }, [params.id]);

  // need this if-statement for `TypeError: Cannot read properties of null`
  if (!arbitraryUser) {
    return <h1>Loading...</h1>;
  }

  // need to reverse the order so that the user's posts are from the newest to the oldest
  const arbitraryUsersPostsArrJSX = arbitraryUser.posts.reverse().map(
    arbitraryUsersPost => {
      return (
        <Post key={arbitraryUsersPost.id} post={arbitraryUsersPost} />
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