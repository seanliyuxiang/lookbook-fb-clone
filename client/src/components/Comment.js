import {Link} from 'react-router-dom';
import {useState} from 'react';
import FormToEditComment from './FormToEditComment';
import blankProfilePicture from '../images/blank_profile_picture.png';

function Comment({postsComment, user, setPostsCommentsWrapperToRemoveComment, setPostsCommentsWrapperToUpdateComment}) {

  const [isEditingComment, setIsEditingComment] = useState(false);

  if (isEditingComment) {
    return (
      <FormToEditComment
        postsComment={postsComment}
        setPostsCommentsWrapperToUpdateComment={setPostsCommentsWrapperToUpdateComment}
        setIsEditingComment={setIsEditingComment}
        editCommentHandler={editCommentHandler}
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
    <article className='comment'>
      <Link to={`/users/${postsComment.author_id}`} title={postsComment.author.first_name} className='thumb'>
        <img
          src={!postsComment.author.profile_picture_url ? blankProfilePicture : postsComment.author.profile_picture_url}
          alt=''
        />
      </Link>
      <div className='comment-body'>
        <h2>
          <Link to={`/users/${postsComment.author.id}`}>
            {`${postsComment.author.first_name} ${postsComment.author.last_name}`}
          </Link>
        </h2>
        <p>{postsComment.body}</p>
        <footer className='comment-footer'>
          <ul className='comment-footer-tools'>
            {postsComment.author_id === user.id ?
              <>
                <li><button onClick={deleteCommentHandler}>Delete</button></li>
                <li><button onClick={editCommentHandler}>Edit</button></li>
              </>
            : null}
          </ul>
        </footer>
      </div>
    </article>
  );
}

export default Comment;