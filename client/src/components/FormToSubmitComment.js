import {useState} from 'react';

function FormToSubmitComment({post, user, setPostsCommentsWrapperToAddNewComment}) {

  const [commentFormData, setCommentFormData] = useState({
    author_id: user.id,
    post_id: post.id,
    body: ''
  });

  function changeCommentFormDataHandler(event) {
    setCommentFormData({
      ...commentFormData,
      [event.target.name]: event.target.value
    });
  }

  function submitCommentFormDataHandler(event) {
    event.preventDefault();

    fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentFormData)
    })
    .then(response => response.json())
      .then(comment => setPostsCommentsWrapperToAddNewComment(comment)); // may need to change the 2nd `.then()` to render errors based on the response status
  }

  return (
    <form onSubmit={submitCommentFormDataHandler}>
        <input
          type='text'
          name='body'
          placeholder='Write a comment...'
          value={commentFormData.body}
          onChange={changeCommentFormDataHandler}
        />
        <button>Comment</button>
      </form>
  );
}

export default FormToSubmitComment;