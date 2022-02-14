function SearchResultsContainer({displayedUsers, searchString}) {

  const displayedUsersArrJSX = displayedUsers.map(
    user => {
      return (
        <p key={user.id}>{`${user.first_name} ${user.last_name}`}</p>
      );
    }
  );
  
  return (
    <div>
      {searchString === '' ?
        null
      : displayedUsersArrJSX}
    </div>
  );
}

export default SearchResultsContainer;