import {useState, useEffect} from 'react';
import Post from './Post';
import FormToSubmitPost from './FormToSubmitPost';
import TrySearching from './TrySearching';
import {Link} from 'react-router-dom';
import {monthAbbreviatedNames} from '../lib/dateTimeHelpers';
import CakeIcon from '@mui/icons-material/Cake';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import energiaLogo from '../images/energia.png';
import donovanVenturesLogo from '../images/donovan_ventures.png';

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
      <section className='content-main'>
        <FormToSubmitPost user={user} setFriendsAuthoredPostsWrapperToAddNewAuthoredPost={setFriendsAuthoredPostsWrapperToAddNewAuthoredPost} />
        {friendsAuthoredPostsArrJSX.length > 0
          ? <div className='posts'>
            {friendsAuthoredPostsArrJSX}
          </div>
          : <div className='container-content-to-end'>
            <TrySearching />
          </div>
        }
      </section>

      <section className='content-sidebar home-feed'>
      </section>
    </main>
  );
}

export default HomeFeed;