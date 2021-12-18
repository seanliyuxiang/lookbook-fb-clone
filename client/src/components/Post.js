import Comment from './Comment';
import {Link} from 'react-router-dom';
import FormToSubmitComment from './FormToSubmitComment';
import {useState} from 'react';

function Post({post, user, setArbitraryUserWrapperToRemovePost, setFriendsPostsWrapperToRemovePost}) {

  const [postsComments, setPostsComments] = useState(post.comments);

  const postsCommentsArrJSX = postsComments.map(
    postsComment => {
      return (
        <Comment key={postsComment.id} postsComment={postsComment} />
      );
    }
  );

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

  return (
    <div className='post'>
      <h1>coming from Post.js</h1>
      
      <h1>Posted by: <Link to={`/users/${post.author_id}`}>{post.author_full_name}</Link></h1>
      <h1>post body: {post.body}</h1>
      {post.author_id === user.id ?
        <>
          <button onClick={deletePostHandler}>Delete</button>
          <button>Edit</button>
        </>
      : null}
      {postsCommentsArrJSX}
      <FormToSubmitComment post={post} user={user} setPostsCommentsWrapperToAddNewComment={setPostsCommentsWrapperToAddNewComment} />
    </div>
  );
}

export default Post;