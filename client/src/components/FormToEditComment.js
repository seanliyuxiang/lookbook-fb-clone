import {useState} from 'react';
import {Link} from 'react-router-dom';
import blankProfilePicture from '../images/blank_profile_picture.png';

function FormToEditComment({postsComment, setPostsCommentsWrapperToUpdateComment, setIsEditingComment, editCommentHandler}) {

  const [editedCommentFormData, setEditedCommentFormData] = useState({
    body: postsComment.body
  });

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
            type='text'
            name='body'
            value={editedCommentFormData.body}
            onChange={changeEditedCommentFormDataHandler}
          />
          <footer className='comment-footer'>
            <ul className='comment-footer-tools'>
              <li><button onClick={editCommentHandler}>Cancel</button></li>
              <li><button>Save</button></li>
            </ul>
          </footer>
        </form>
      </div>
    </article>
  );
}

export default FormToEditComment;