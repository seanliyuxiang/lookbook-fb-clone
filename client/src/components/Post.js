import Comment from './Comment';

function Post({friendsPost}) {
  const postsCommentsArrJSX = friendsPost.comments.map(
    postsComment => {
      return (
        <Comment key={postsComment.id} postsComment={postsComment} />
      );
    }
  );

  return (
    <div className='post'>
      <h1>coming from Post.js</h1>
      <h1>Posted by: {friendsPost.author_full_name}</h1>
      <h1>post body: {friendsPost.body}</h1>
      {postsCommentsArrJSX}
    </div>
  );
}

export default Post;