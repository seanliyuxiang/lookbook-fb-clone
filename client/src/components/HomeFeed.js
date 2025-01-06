import {useState, useEffect, useMemo} from 'react';
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

  // friends with confirmed assertive_friendships and passive_friendships of the logged-in user
  const friendsConfirmed = useMemo(() => {
    const friendsFromConfirmedAssertiveFriendships = user.assertive_friendships.filter(
      assertiveFriendship => assertiveFriendship.status.toLowerCase() === 'confirmed'
    ).map(
      assertiveFriendship => {
        return ({
          id: assertiveFriendship.friend.id,
          firstName: assertiveFriendship.friend.first_name,
          lastName: assertiveFriendship.friend.last_name,
          birthday: assertiveFriendship.friend.birthday
        });
      }
    );

    const usersFromConfirmedPassiveFriendships = user.passive_friendships.filter(
      passiveFriendship => passiveFriendship.status.toLowerCase() === 'confirmed'
    ).map(
      passiveFriendship => {
        return ({
          id: passiveFriendship.user.id,
          firstName: passiveFriendship.user.first_name,
          lastName: passiveFriendship.user.last_name,
          birthday: passiveFriendship.user.birthday
        });
      }
    );

    return friendsFromConfirmedAssertiveFriendships.concat(usersFromConfirmedPassiveFriendships);
  }, [user]);

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