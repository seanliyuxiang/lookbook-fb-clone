import {Link} from 'react-router-dom';
import {useState} from 'react';
import FormToEditComment from './FormToEditComment';

function Comment({postsComment, user, setPostsCommentsWrapperToRemoveComment, setPostsCommentsWrapperToUpdateComment}) {

  const [isEditingComment, setIsEditingComment] = useState(false);

  if (isEditingComment) {
    return (
      <FormToEditComment
        postsComment={postsComment}
        setPostsCommentsWrapperToUpdateComment={setPostsCommentsWrapperToUpdateComment}
        setIsEditingComment={setIsEditingComment}
      />
    );
  }

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

  function editCommentHandler() {
    setIsEditingComment(!isEditingComment);
  }

  return (
    <div className='comment'>
      <h1>coming from Comment.js</h1>
      <h1>Commented by: <Link to={`/users/${postsComment.author_id}`}>{postsComment.author_full_name}</Link></h1>
      <h1>comment body: {postsComment.body}</h1>
      {postsComment.author_id === user.id ?
        <>
          <button onClick={deleteCommentHandler}>Delete</button>
          <button onClick={editCommentHandler}>Edit</button>
        </>
      : null}
    </div>
  );
}

export default Comment;