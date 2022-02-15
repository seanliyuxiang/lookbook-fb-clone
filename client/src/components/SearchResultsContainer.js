import {Link} from 'react-router-dom';

function SearchResultsContainer({displayedUsers, searchString}) {

  const displayedUsersArrJSX = displayedUsers.map(user => {
    return (
      <p key={user.id}>
        <Link to={`/users/${user.id}`}>{`${user.first_name} ${user.last_name}`}</Link>
      </p>
    );
  });
  
  return (
    <div>
      {searchString === '' ?
        null
      : displayedUsersArrJSX}
    </div>
  );
}

export default SearchResultsContainer;