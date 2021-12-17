import {useState, useEffect} from 'react';
import Post from './Post';
import FormToSubmitPost from './FormToSubmitPost';

// container component for logged-in user's friends' posts
function HomeFeed({user}) {

  const [friendsPosts, setFriendsPosts] = useState([]);

  useEffect(() => {
    fetch('/api/home_feed')
    .then(response => response.json())
    .then(posts => setFriendsPosts(posts));
  }, []);

  function setFriendsPostsWrapperToRemovePost(deletedPost) {
    setFriendsPosts(friendsPosts.filter(post => post.id !== deletedPost.id)); // filter out the deleted post
  }

  const friendsPostsArrJSX = friendsPosts.map(
    friendsPost => {
      return (
        <Post
          key={friendsPost.id}
          post={friendsPost}
          user={user}
          setFriendsPostsWrapperToRemovePost={setFriendsPostsWrapperToRemovePost}
        />
      );
    }
  );

  /*
  once a new post is submitted from the home feed page,
  the new post is immediately appended to the top of the home feed page
  */
  function setFriendsPostsWrapper(newPost) {
    setFriendsPosts([newPost, ...friendsPosts]);
  }

  return (
    <div>
      <h1>coming from HomeFeed.js</h1>
      <FormToSubmitPost user={user} setFriendsPostsWrapper={setFriendsPostsWrapper} />
      {friendsPostsArrJSX}
    </div>
  );
}

export default HomeFeed;