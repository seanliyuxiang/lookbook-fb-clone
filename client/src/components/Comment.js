import {Link} from 'react-router-dom';
import {useState} from 'react';
import FormToEditComment from './FormToEditComment';
import blankProfilePicture from '../images/blank_profile_picture.png';
import {formatDistanceToNow, monthFullNames} from '../lib/dateTimeHelpers';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// 1 year = 12.0082 months = 31557584000 milliseconds
const millisecondsInOneYear = 31557584000;

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

  const commentCreatedAtDateObj = new Date(postsComment.created_at);

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
        <p>{postsComment.body}</p>
        <footer className='comment-footer'>
          <ul className='comment-footer-tools'>
            {postsComment.author_id === user.id ?
              <>
                <li><button onClick={editCommentHandler}><EditIcon />Edit</button></li>
                <li><button onClick={deleteCommentHandler}><DeleteIcon />Delete</button></li>
              </>
            : null}
          </ul>
        </footer>
      </div>
    </article>
  );
}

export default Comment;