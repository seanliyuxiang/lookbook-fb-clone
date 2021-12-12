import {Link} from 'react-router-dom';

function Comment({postsComment}) {
  return (
    <div className='comment'>
      <h1>coming from Comment.js</h1>
      <h1>Commented by: <Link to={`/users/${postsComment.author_id}`}>{postsComment.author_full_name}</Link></h1>
      <h1>comment body: {postsComment.body}</h1>
    </div>
  );
}

export default Comment;