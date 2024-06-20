import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import blankProfilePicture from '../images/blank_profile_picture.png';
import {formatDistanceToNow, monthFullNames} from '../lib/dateTimeHelpers';
import FormToSubmitComment from './FormToSubmitComment';
import Tooltip from '@mui/material/Tooltip';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ThumbUpIconOutlined from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';

// 1 year = 12.0082 months = 31557584000 milliseconds
const millisecondsInOneYear = 31557584000;

function FormToEditPost({post, setArbitraryUserWrapperToUpdateWallPost, setIsEditingPost, setFriendsAuthoredPostsWrapperToUpdateAuthoredPost, user, postsLikes, isPostLiked, toggleLikePostHandler, editPostHandler, postsCommentsArrJSX, setPostsCommentsWrapperToAddNewComment}) {

  const [editedPostFormData, setEditedPostFormData] = useState({
    body: post.body
  });

  /*
  https://react.dev/learn/synchronizing-with-effects#focus-a-field-on-mount
  In this case, the side effect is caused by the component appearing rather than by any specific interaction, so it makes sense to put it in an Effect.
  Then, to ensure that this Effect runs only on mount rather than after every render, add the empty [] dependencies to it.
  */
  const postBodyTextInputRef = useRef(null);
  
  useEffect(() => {
    postBodyTextInputRef.current.focus();
  }, []);

  function changeEditedPostFormDataHandler(event) {
    setEditedPostFormData({
      ...editedPostFormData,
      [event.target.name]: event.target.value
    });
  }

  function submitEditedPostFormDataHandler(event) {
    event.preventDefault();

    fetch(`/api/posts/${post.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedPostFormData)
    })
    .then(response => {
      if (response.ok) {
        response.json().then(post => {
          if (!setFriendsAuthoredPostsWrapperToUpdateAuthoredPost) {
            setArbitraryUserWrapperToUpdateWallPost(post);
          } else {
            setFriendsAuthoredPostsWrapperToUpdateAuthoredPost(post);
          }
          setIsEditingPost(false);
        });
      }
    });
  }

  const postCreatedAtDateObj = new Date(post.created_at);

  return (
    <article className='post'>
      <Link to={`/users/${post.author_id}`} title={post.author.first_name} className='thumb'>
        <img
          src={!post.author.profile_picture_url ? blankProfilePicture : post.author.profile_picture_url}
          alt=''
        />
      </Link>
      <div className='post-body'>
        <h2>
          <Link to={`/users/${post.author.id}`}>
            {`${post.author.first_name} ${post.author.last_name}`}
          </Link>
        </h2>
        <p className='post-body-timestamp'>
          {Date.now() - postCreatedAtDateObj.getTime() <= millisecondsInOneYear
            ? formatDistanceToNow(post.created_at)
            : `${monthFullNames[postCreatedAtDateObj.getMonth()]} ${postCreatedAtDateObj.getDate()}, ${postCreatedAtDateObj.getFullYear()}`
          }
        </p>
        <form onSubmit={submitEditedPostFormDataHandler}>
          <div>
            <input
              ref={postBodyTextInputRef}
              type='text'
              name='body'
              value={editedPostFormData.body}
              onChange={changeEditedPostFormDataHandler}
            />
            <div className='post-body-edit-tools'>
              <Tooltip title='Cancel' arrow>
                <button onClick={editPostHandler}>
                  <CancelIcon />
                </button>
              </Tooltip>
              <Tooltip title='Save' arrow>
                <button>
                  <SaveAltIcon />
                </button>
              </Tooltip>
            </div>
          </div>
          {post.post_photo_url ?
            <img src={post.post_photo_url} alt='' />
          : null}
          <footer className='post-footer'>
            <ul className='post-footer-tools'>
              <li>
                <button onClick={toggleLikePostHandler} style={{color: isPostLiked ? 'rgb(65, 89, 147)' : undefined}}>
                  {isPostLiked ?
                    <>
                      <ThumbUpIcon />
                      Liked
                    </>
                  : <>
                    <ThumbUpIconOutlined />
                    Like
                  </>}
                </button>
              </li>
              <li><button><CommentIcon />Comment</button></li>
            </ul>
          </footer>
        </form>
        {postsLikes.length >= 1 &&
          <p className='total-likes'>
            <ThumbUpIcon fontSize='small' />
            {`${postsLikes.length} Like${postsLikes.length === 1 ? '' : 's'}`}
          </p>
        }
        {postsCommentsArrJSX.length >= 1 &&
          <div className='comments'>
            {postsCommentsArrJSX}
          </div>
        }
        <FormToSubmitComment post={post} user={user} setPostsCommentsWrapperToAddNewComment={setPostsCommentsWrapperToAddNewComment} />
      </div>
    </article>
  );
}

export default FormToEditPost;