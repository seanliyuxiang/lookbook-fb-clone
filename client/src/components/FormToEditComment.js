import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import blankProfilePicture from '../images/blank_profile_picture.png';
import {formatDistanceToNow, monthFullNames} from '../lib/dateTimeHelpers';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ValidationErrorMessage from './ValidationErrorMessage';

// 1 year = 12.0082 months = 31557584000 milliseconds
const millisecondsInOneYear = 31557584000;

function FormToEditComment({postsComment, setPostsCommentsWrapperToUpdateComment, setIsEditingComment, editCommentHandler}) {

  const [editedCommentFormData, setEditedCommentFormData] = useState({
    body: postsComment.body
  });

  const [validationErrors, setValidationErrors] = useState(null);

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
      } else {
        response.json().then(errorData => setValidationErrors(errorData));
      }
    });
  }

  const commentCreatedAtDateObj = new Date(postsComment.created_at);

  const isButtonToSaveDisabled = editedCommentFormData.body.trim() === '';

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
        <p className='comment-body-timestamp'>
          {Date.now() - commentCreatedAtDateObj.getTime() <= millisecondsInOneYear
            ? formatDistanceToNow(postsComment.created_at)
            : `${monthFullNames[commentCreatedAtDateObj.getMonth()]} ${commentCreatedAtDateObj.getDate()}, ${commentCreatedAtDateObj.getFullYear()}`
          }
        </p>
        <form onSubmit={submitEditedCommentFormDataHandler}>
          <input
            ref={commentBodyTextInputRef}
            type='text'
            name='body'
            value={editedCommentFormData.body}
            onChange={changeEditedCommentFormDataHandler}
          />
          {validationErrors && (Object.keys(validationErrors).length > 0) &&
            <ValidationErrorMessage
              messageStr={Object.values(validationErrors).flat(Infinity).join(' ')}
              errorStyle={{
                marginTop: '-10px',
                marginBottom: '20px'
              }}
            />
          }
          <footer className='comment-footer'>
            <ul className='comment-footer-tools'>
              <li>
                <button onClick={editCommentHandler}>
                  <CancelIcon />
                  Cancel
                </button>
              </li>
              <li>
                <button
                  disabled={isButtonToSaveDisabled}
                  style={{
                    color: isButtonToSaveDisabled ? 'rgb(189, 189, 189)' : undefined,
                    cursor: isButtonToSaveDisabled ? 'not-allowed' : undefined
                  }}
                >
                  <SaveAltIcon color={isButtonToSaveDisabled ? 'disabled' : undefined} />
                  Save
                </button>
              </li>
            </ul>
          </footer>
        </form>
      </div>
    </article>
  );
}

export default FormToEditComment;