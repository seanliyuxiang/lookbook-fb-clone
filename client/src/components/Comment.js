function Comment({postsComment}) {
  return (
    <div className='comment'>
      <h1>coming from Comment.js</h1>
      <h1>  Commented by: {postsComment.author_full_name}</h1>
      <h1>    comment body: {postsComment.body}</h1>
    </div>
  );
}

export default Comment;