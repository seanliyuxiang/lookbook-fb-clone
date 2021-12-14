import Comment from './Comment';
import {Link} from 'react-router-dom';
import FormToSubmitComment from './FormToSubmitComment';
import {useState} from 'react';

function Post({post, user}) {

  const [postsComments, setPostsComments] = useState(post.comments);

  const postsCommentsArrJSX = postsComments.map(
    postsComment => {
      return (
        <Comment key={postsComment.id} postsComment={postsComment} />
      );
    }
  );

  function setPostsCommentsWrapper(newComment) {
    setPostsComments([...postsComments, newComment]);
  }

  return (
    <div className='post'>
      <h1>coming from Post.js</h1>
      
      <h1>Posted by: <Link to={`/users/${post.author_id}`}>{post.author_full_name}</Link></h1>
      <h1>post body: {post.body}</h1>
      {postsCommentsArrJSX}
      <FormToSubmitComment post={post} user={user} setPostsCommentsWrapper={setPostsCommentsWrapper} />
    </div>
  );
}

export default Post;