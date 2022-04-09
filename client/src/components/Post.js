import Comment from './Comment';
import {Link} from 'react-router-dom';
import FormToSubmitComment from './FormToSubmitComment';
import {useState} from 'react';
import FormToEditPost from './FormToEditPost';
import blankProfilePicture from '../images/blank_profile_picture.png';

function Post({post, user, setArbitraryUserWrapperToRemoveWallPost, setFriendsAuthoredPostsWrapperToRemoveAuthoredPost, setArbitraryUserWrapperToUpdateWallPost, setFriendsAuthoredPostsWrapperToUpdateAuthoredPost}) {

  const [postsComments, setPostsComments] = useState(post.comments);
  const [isEditingPost, setIsEditingPost] = useState(false);
  
  const [postsLikes, setPostsLikes] = useState(post.likes);
  const isPostLiked = postsLikes.map(like => like.liker_id).includes(user.id);

  function setPostsCommentsWrapperToRemoveComment(deletedComment) {
    setPostsComments(postsComments.filter(
      comment => comment.id !== deletedComment.id
    ));
  }

  function setPostsCommentsWrapperToUpdateComment(updatedComment) {
    setPostsComments(postsComments.map(comment => {
      if (comment.id === updatedComment.id) {
        return updatedComment;
      } else {
        return comment;
      }
    }));
  }

  const postsCommentsArrJSX = postsComments.map(
    postsComment => {
      return (
        <Comment
          key={postsComment.id}
          postsComment={postsComment}
          user={user}
          setPostsCommentsWrapperToRemoveComment={setPostsCommentsWrapperToRemoveComment}
          setPostsCommentsWrapperToUpdateComment={setPostsCommentsWrapperToUpdateComment}
        />
      );
    }
  );

  if (isEditingPost) {
    return (
      <div>
        <FormToEditPost
          post={post}
          setArbitraryUserWrapperToUpdateWallPost={setArbitraryUserWrapperToUpdateWallPost}
          setIsEditingPost={setIsEditingPost}
          setFriendsAuthoredPostsWrapperToUpdateAuthoredPost={setFriendsAuthoredPostsWrapperToUpdateAuthoredPost}
        />
        {postsCommentsArrJSX}
      </div>
    );
  }

  function setPostsCommentsWrapperToAddNewComment(newComment) {
    setPostsComments([...postsComments, newComment]);
  }

  function deletePostHandler() {
    fetch(`/api/posts/${post.id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        response.json().then(post => {
          if (!setFriendsAuthoredPostsWrapperToRemoveAuthoredPost) {
            setArbitraryUserWrapperToRemoveWallPost(post);
          } else {
            setFriendsAuthoredPostsWrapperToRemoveAuthoredPost(post);
          }
        });
      }
    });
  }

  function editPostHandler() {
    setIsEditingPost(!isEditingPost);
  }

  function toggleLikePostHandler() {
    if (!isPostLiked) { // if post is NOT already liked, create a like
      fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          liker_id: user.id,
          post_id: post.id
        })
      })
      .then(response => {
        if (response.ok) {
          response.json().then(newLike => setPostsLikes([...postsLikes, newLike]));
        }
      });
    } else {  // if post is already liked, delete a like
      let likeID;
      for (let like of postsLikes) {
        if (like.liker_id === user.id && like.post_id === post.id) {
          likeID = like.id;
        }
      }

      fetch(`/api/likes/${likeID}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          response.json().then(deletedLike => setPostsLikes(
            postsLikes.filter(postsLike => postsLike.id !== deletedLike.id)
          ));
        }
      });
    }
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
        <p>{post.body}</p>
        {post.post_photo_url ?
          <img src={post.post_photo_url} alt='' />
        : null}
        <footer className='post-footer'>
          <ul className='post-footer-tools'>
            <li><button onClick={toggleLikePostHandler}>{isPostLiked ? 'Liked' : 'Not liked'}</button></li>
            <li>Comment</li>
            {post.author_id === user.id ?
              <>
                <li><button onClick={deletePostHandler}>Delete</button></li>
                <li><button onClick={editPostHandler}>Edit</button></li>
              </>
            : null}
          </ul>
        </footer>
        <p>{postsLikes.length > 1 ? `${postsLikes.length} Likes` : (postsLikes.length === 1 ? '1 Like' : null)}</p> {/* ternary within a ternary */}
        <div className='comments'>
          {postsCommentsArrJSX}
        </div>
        <FormToSubmitComment post={post} user={user} setPostsCommentsWrapperToAddNewComment={setPostsCommentsWrapperToAddNewComment} />
      </div>
    </article>
  );
}

export default Post;