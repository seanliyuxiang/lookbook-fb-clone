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

const upperTimeLimitForUpcomingBirthday = 518400000; // 6 days = 518400000 milliseconds

/**
 * Function that filters down to just the people whose upcoming birthdays will occur within the specified range
 * @param {{ id: number; firstName: string; lastName: string; birthday: string; }[]} friends 
 * @param {{ id: number; firstName: string; lastName: string; birthday: string; }} loggedInUser 
 * @returns 
 */
function getFriendsWithUpcomingBirthdays(friends, loggedInUser) {
  // want to include the logged-in user's own birthday as well
  const friendsAndLoggedInUser = friends.concat(loggedInUser);

  // filter people with birthdays to within the range between today and the upper limit inclusive
  return friendsAndLoggedInUser.filter(person => {
    const birthdayArr = person.birthday.split('-');
    birthdayArr[0] = String((new Date()).getUTCFullYear()); // `getUTCFullYear` or `getFullYear` ???

    const birthdayThisYear = birthdayArr.join('-');
    // `Date.parse(birthdayThisYear)` evaluates to the same value as `(new Date(birthdayThisYear)).getTime()`
    const timestampOfBirthdayThisYear = Date.parse(birthdayThisYear);

    return (
      (Date.now() <= timestampOfBirthdayThisYear) &&
      (timestampOfBirthdayThisYear <= (Date.now() + upperTimeLimitForUpcomingBirthday))
    );
  });
}

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
  }, [user]);

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

  const friendsWithUpcomingBirthdays = getFriendsWithUpcomingBirthdays(friendsConfirmed, {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    birthday: user.birthday
  });

  // sorted in the order the birthdays will occur (array is sorted in place)
  friendsWithUpcomingBirthdays.sort((person1, person2) => {
    // for person 1
    const birthdayArrForPerson1 = person1.birthday.split('-');
    birthdayArrForPerson1[0] = String((new Date()).getUTCFullYear()); // `getUTCFullYear` or `getFullYear` ???
    const birthdayThisYearForPerson1 = birthdayArrForPerson1.join('-');
    const timestampOfBirthdayThisYearForPerson1 = Date.parse(birthdayThisYearForPerson1);

    // for person 2
    const birthdayArrForPerson2 = person2.birthday.split('-');
    birthdayArrForPerson2[0] = String((new Date()).getUTCFullYear()); // `getUTCFullYear` or `getFullYear` ???
    const birthdayThisYearForPerson2 = birthdayArrForPerson2.join('-');
    const timestampOfBirthdayThisYearForPerson2 = Date.parse(birthdayThisYearForPerson2);

    return timestampOfBirthdayThisYearForPerson1 - timestampOfBirthdayThisYearForPerson2;
  });

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
        <div className='sidebar-events'>
          <h2>Events</h2>
          <ul>
            {friendsWithUpcomingBirthdays.length > 0
              ? friendsWithUpcomingBirthdays.map(person => {
                const bdayArr = person.birthday.split('-');
                return (
                  <li key={person.id}>
                    <CakeIcon />
                    <p>
                      <Link to={`/users/${person.id}`}>
                        {person.id === user.id
                          ? 'Your'
                          : `${person.firstName} ${person.lastName}`
                        }
                      </Link>
                      {person.id === user.id ? ' birthday ' : `'s birthday `}
                      <span className='sidebar-events-date'>
                        {`${monthAbbreviatedNames[Number(bdayArr[1])-1]} ${Number(bdayArr[2])}`}
                      </span>
                    </p>
                  </li>
                );
              })
              : <li>
                <CakeIcon />
                <p>No birthdays coming up</p>
              </li>
            }
          </ul>
        </div>
        <div className='sidebar-sponsored'>
          <h2>Sponsored</h2>
          <ul>
            <li>
              <a href='https://www.energia.com/' target='_blank'>
                <img src={energiaLogo} alt='' />
              </a>
            </li>
            <li>
              <a href='https://www.dv-llc.com/' target='_blank'>
                <img src={donovanVenturesLogo} alt='' />
              </a>
            </li>
          </ul>
        </div>
        <div className='sidebar-trending'>
          <h2>Trending</h2>
          <ul>
            <li>
              <TrendingUpIcon />
              <a href='https://onepetro.org/SJ/article-abstract/22/05/1349/206025/Scaling-of-Low-Interfacial-Tension-Imbibition-in?redirectedFrom=fulltext' target='_blank'>
                A new analytical model predicts oil recovery based on rock fracture spacing
              </a>
            </li>
            <li>
              <TrendingUpIcon />
              <a href='https://repositories.lib.utexas.edu/items/0a9c2732-1a97-4020-b5f8-f473656506c9' target='_blank'>
                Lab experiments shed new light in oil recovery under low interfacial tension conditions
              </a>
            </li>
            <li>
              <TrendingUpIcon />
              <a href='https://onepetro.org/SPEIOR/proceedings-abstract/16IOR/16IOR/SPE-179684-MS/186591' target='_blank'>
                A novel method to recover oil from low-permeability rocks
              </a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default HomeFeed;