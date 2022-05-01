import {useState} from 'react';
import {Link} from 'react-router-dom';
import blankProfilePicture from '../images/blank_profile_picture.png';
import FormToSubmitComment from './FormToSubmitComment';

function FormToEditPost({post, setArbitraryUserWrapperToUpdateWallPost, setIsEditingPost, setFriendsAuthoredPostsWrapperToUpdateAuthoredPost, user, postsLikes, isPostLiked, toggleLikePostHandler, editPostHandler, postsCommentsArrJSX, setPostsCommentsWrapperToAddNewComment}) {

  const [editedPostFormData, setEditedPostFormData] = useState({
    body: post.body
  });

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
        <form onSubmit={submitEditedPostFormDataHandler}>
          <input
            type='text'
            name='body'
            value={editedPostFormData.body}
            onChange={changeEditedPostFormDataHandler}
          />
          {post.post_photo_url ?
            <img src={post.post_photo_url} alt='' />
          : null}
          <footer className='post-footer'>
            <ul className='post-footer-tools'>
              <li><button onClick={toggleLikePostHandler}>{isPostLiked ? 'Liked' : 'Not liked'}</button></li>
              <li>Comment</li>
              <li><button onClick={editPostHandler}>Cancel</button></li>
              <li><button>Save</button></li>
            </ul>
          </footer>
        </form>
        <p>{postsLikes.length > 1 ? `${postsLikes.length} Likes` : (postsLikes.length === 1 ? '1 Like' : null)}</p> {/* ternary within a ternary */}
        <div className='comments'>
          {postsCommentsArrJSX}
        </div>
        <FormToSubmitComment post={post} user={user} setPostsCommentsWrapperToAddNewComment={setPostsCommentsWrapperToAddNewComment} />
      </div>
    </article>
  );
}

export default FormToEditPost;