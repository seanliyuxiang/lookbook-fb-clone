import {Link} from 'react-router-dom';
import blankProfilePicture from '../images/blank_profile_picture.png';

function SearchResultsContainer({displayedUsers, searchString}) {

  const displayedUsersArrJSX = displayedUsers.map(user => {
    return (
      <li key={user.id}>
        <Link to={`/users/${user.id}`} title={user.first_name} className='thumb search-results-thumb'>
          <img
            src={!user.profile_picture_url ? blankProfilePicture : user.profile_picture_url}
            alt=''
          />
        </Link>
        <h2>
          <Link to={`/users/${user.id}`}>
            {`${user.first_name} ${user.last_name}`}
          </Link>
        </h2>
      </li>
    );
  });
  
  return (
    <>
      {searchString === '' ?
        null
      : <ul className='search-results'>
        {displayedUsersArrJSX}
      </ul>}
    </>
  );
}

export default SearchResultsContainer;