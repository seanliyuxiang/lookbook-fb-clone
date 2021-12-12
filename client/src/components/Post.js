import Comment from './Comment';
import {Link} from 'react-router-dom';

function Post({post}) {
  const postsCommentsArrJSX = post.comments.map(
    postsComment => {
      return (
        <Comment key={postsComment.id} postsComment={postsComment} />
      );
    }
  );

  return (
    <div className='post'>
      <h1>coming from Post.js</h1>
      
      <h1>Posted by: <Link to={`/users/${post.author_id}`}>{post.author_full_name}</Link></h1>
      <h1>post body: {post.body}</h1>
      {postsCommentsArrJSX}
    </div>
  );
}

export default Post;