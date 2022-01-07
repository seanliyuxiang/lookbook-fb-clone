import Comment from './Comment';
import {Link} from 'react-router-dom';
import FormToSubmitComment from './FormToSubmitComment';
import {useState} from 'react';
import FormToEditPost from './FormToEditPost';

function Post({post, user, setArbitraryUserWrapperToRemovePost, setFriendsPostsWrapperToRemovePost, setArbitraryUserWrapperToUpdatePost, setFriendsPostsWrapperToUpdatePost}) {

  const [postsComments, setPostsComments] = useState(post.comments);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(
    post.likers.map(liker => liker.id).includes(user.id)
  );

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
          setArbitraryUserWrapperToUpdatePost={setArbitraryUserWrapperToUpdatePost}
          setIsEditingPost={setIsEditingPost}
          setFriendsPostsWrapperToUpdatePost={setFriendsPostsWrapperToUpdatePost}
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
          if (!setFriendsPostsWrapperToRemovePost) {
            setArbitraryUserWrapperToRemovePost(post);
          } else {
            setFriendsPostsWrapperToRemovePost(post);
          }
        });
      }
    });
  }

  function editPostHandler() {
    setIsEditingPost(!isEditingPost);
  }

  function toggleLikePostHandler() {
    if (!isPostLiked) {
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
          response.json().then(() => setIsPostLiked(true));
        }
      })
    }
  }

  return (
    <div className='post'>
      <h1>coming from Post.js</h1>
      
      <h1>Posted by: <Link to={`/users/${post.author_id}`}>{post.author_full_name}</Link></h1>
      <h1>post body: {post.body}</h1>
      {post.author_id === user.id ?
        <>
          <button onClick={deletePostHandler}>Delete</button>
          <button onClick={editPostHandler}>Edit</button>
          <br />
        </>
      : null}
      <button onClick={toggleLikePostHandler}>{isPostLiked ? 'Liked' : 'Not liked'}</button>
      {postsCommentsArrJSX}
      <FormToSubmitComment post={post} user={user} setPostsCommentsWrapperToAddNewComment={setPostsCommentsWrapperToAddNewComment} />
    </div>
  );
}

export default Post;