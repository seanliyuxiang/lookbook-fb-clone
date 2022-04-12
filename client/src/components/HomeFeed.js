import {useState, useEffect} from 'react';
import Post from './Post';
import FormToSubmitPost from './FormToSubmitPost';

// container component for logged-in user's friends' authored posts
function HomeFeed({user}) {

  const [friendsAuthoredPosts, setFriendsAuthoredPosts] = useState([]);

  useEffect(() => {
    fetch('/api/home_feed')
    .then(response => response.json())
    .then(posts => setFriendsAuthoredPosts(posts));
  }, []);

  function setFriendsAuthoredPostsWrapperToRemoveAuthoredPost(deletedAuthoredPost) {
    setFriendsAuthoredPosts(friendsAuthoredPosts.filter(authoredPost => authoredPost.id !== deletedAuthoredPost.id)); // filter out the deleted authored post
  }

  function setFriendsAuthoredPostsWrapperToUpdateAuthoredPost(updatedAuthoredPost) {
    setFriendsAuthoredPosts(friendsAuthoredPosts.map(authoredPost => {
      if (authoredPost.id === updatedAuthoredPost.id) {
        return updatedAuthoredPost; // replace with the updated authored post
      } else {
        return authoredPost;
      }
    }));
  }

  const friendsAuthoredPostsArrJSX = friendsAuthoredPosts.map(
    friendsAuthoredPost => {
      return (
        <Post
          key={friendsAuthoredPost.id}
          post={friendsAuthoredPost}
          user={user}
          setFriendsAuthoredPostsWrapperToRemoveAuthoredPost={setFriendsAuthoredPostsWrapperToRemoveAuthoredPost}
          setFriendsAuthoredPostsWrapperToUpdateAuthoredPost={setFriendsAuthoredPostsWrapperToUpdateAuthoredPost}
        />
      );
    }
  );

  /*
  once a new authored post is submitted from the home feed page,
  the new authored post is immediately appended to the top of the home feed page
  */
  function setFriendsAuthoredPostsWrapperToAddNewAuthoredPost(newAuthoredPost) {
    setFriendsAuthoredPosts([newAuthoredPost, ...friendsAuthoredPosts]);
  }

  return (
    <main className='content'>
      <section className='content-main home-feed'>
        <FormToSubmitPost user={user} setFriendsAuthoredPostsWrapperToAddNewAuthoredPost={setFriendsAuthoredPostsWrapperToAddNewAuthoredPost} />
        <div className='posts'>
          {friendsAuthoredPostsArrJSX}
        </div>
      </section>
    </main>
  );
}

export default HomeFeed;