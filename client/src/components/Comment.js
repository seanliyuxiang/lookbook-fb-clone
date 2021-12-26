import {Link} from 'react-router-dom';

function Comment({postsComment, user, setPostsCommentsWrapperToRemoveComment}) {

  function deleteCommentHandler() {
    fetch(`/api/comments/${postsComment.id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        response.json().then(comment => setPostsCommentsWrapperToRemoveComment(comment));
      }
    });
  }

  return (
    <div className='comment'>
      <h1>coming from Comment.js</h1>
      <h1>Commented by: <Link to={`/users/${postsComment.author_id}`}>{postsComment.author_full_name}</Link></h1>
      <h1>comment body: {postsComment.body}</h1>
      {postsComment.author_id === user.id ?
        <>
          <button onClick={deleteCommentHandler}>Delete</button>
          <button>Edit</button>
        </>
      : null}
    </div>
  );
}

export default Comment;