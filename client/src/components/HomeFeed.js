import {useState, useEffect} from 'react';
import Post from './Post';

// container component for logged-in user's friends' posts
function HomeFeed() {

  const [friendsPosts, setFriendsPosts] = useState([]);

  useEffect(() => {
    fetch('/api/home_feed')
    .then(response => response.json())
    .then(posts => setFriendsPosts(posts));
  }, []);

  const friendsPostsArrJSX = friendsPosts.map(
    friendsPost => {
      return (
        <Post key={friendsPost.id} post={friendsPost} />
      );
    }
  );

  return (
    <div>
      <h1>coming from HomeFeed.js</h1>
      {friendsPostsArrJSX}
    </div>
  );
}

export default HomeFeed;