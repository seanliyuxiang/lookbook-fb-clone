import Comment from './Comment';

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
      
      <h1>Posted by: <a href={`/users/${post.author_id}`}>{post.author_full_name}</a></h1>
      <h1>post body: {post.body}</h1>
      {postsCommentsArrJSX}
    </div>
  );
}

export default Post;