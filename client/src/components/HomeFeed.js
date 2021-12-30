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

  function setFriendsPostsWrapperToUpdatePost(updatedPost) {
    setFriendsPosts(friendsPosts.map(post => {
      if (post.id === updatedPost.id) {
        return updatedPost; // replace with the updated post
      } else {
        return post;
      }
    }));
  }

  const friendsPostsArrJSX = friendsPosts.map(
    friendsPost => {
      return (
        <Post
          key={friendsPost.id}
          post={friendsPost}
          user={user}
          setFriendsPostsWrapperToRemovePost={setFriendsPostsWrapperToRemovePost}
          setFriendsPostsWrapperToUpdatePost={setFriendsPostsWrapperToUpdatePost}
        />
      );
    }
  );

  /*
  once a new post is submitted from the home feed page,
  the new post is immediately appended to the top of the home feed page
  */
  function setFriendsPostsWrapperToAddNewPost(newPost) {
    setFriendsPosts([newPost, ...friendsPosts]);
  }

  return (
    <div>
      <h1>coming from HomeFeed.js</h1>
      <FormToSubmitPost user={user} setFriendsPostsWrapperToAddNewPost={setFriendsPostsWrapperToAddNewPost} />
      {friendsPostsArrJSX}
    </div>
  );
}

export default HomeFeed;