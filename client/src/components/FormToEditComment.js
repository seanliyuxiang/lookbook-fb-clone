import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import blankProfilePicture from '../images/blank_profile_picture.png';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

function FormToEditComment({postsComment, setPostsCommentsWrapperToUpdateComment, setIsEditingComment, editCommentHandler}) {

  const [editedCommentFormData, setEditedCommentFormData] = useState({
    body: postsComment.body
  });

  /*
  https://react.dev/learn/synchronizing-with-effects#focus-a-field-on-mount
  In this case, the side effect is caused by the component appearing rather than by any specific interaction, so it makes sense to put it in an Effect.
  Then, to ensure that this Effect runs only on mount rather than after every render, add the empty [] dependencies to it.
  */
  const commentBodyTextInputRef = useRef(null);

  useEffect(() => {
    commentBodyTextInputRef.current.focus();
  }, []);

  function changeEditedCommentFormDataHandler(event) {
    setEditedCommentFormData({
      ...editedCommentFormData,
      [event.target.name]: event.target.value
    });
  }

  function submitEditedCommentFormDataHandler(event) {
    event.preventDefault();

    fetch(`/api/comments/${postsComment.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedCommentFormData)
    })
    .then(response => {
      if (response.ok) {
        response.json().then(comment => {
          setPostsCommentsWrapperToUpdateComment(comment);
          setIsEditingComment(false);
        });
      }
    });
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
        <form onSubmit={submitEditedCommentFormDataHandler}>
          <input
            ref={commentBodyTextInputRef}
            type='text'
            name='body'
            value={editedCommentFormData.body}
            onChange={changeEditedCommentFormDataHandler}
          />
          <footer className='comment-footer'>
            <ul className='comment-footer-tools'>
              <li><button onClick={editCommentHandler}><CancelIcon />Cancel</button></li>
              <li><button><SaveAltIcon />Save</button></li>
            </ul>
          </footer>
        </form>
      </div>
    </article>
  );
}

export default FormToEditComment;