import {useState} from 'react';

function FormToEditComment({postsComment, setPostsCommentsWrapperToUpdateComment, setIsEditingComment}) {

  const [editedCommentFormData, setEditedCommentFormData] = useState({
    body: postsComment.body
  });

  function changeEditedCommentFormDataHandler(event) {
    setEditedCommentFormData({
      ...editedCommentFormData,
      [event.target.name]: event.target.value
    });
  }

  function submitEditedCommentFormDataHandler(event) {
    event.preventDefault();

    fetch(`/api/comments/${postsComment.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedCommentFormData)
    })
    .then(response => {
      if (response.ok) {
        response.json().then(comment => {
          setPostsCommentsWrapperToUpdateComment(comment);
          setIsEditingComment(false);
        });
      }
    });
  }

  return (
    <div>
      <h1>coming from FormToEditComment.js</h1>
      <form onSubmit={submitEditedCommentFormDataHandler}>
        <input
          type='text'
          name='body'
          value={editedCommentFormData.body}
          onChange={changeEditedCommentFormDataHandler}
        />
        <button>Save</button>
      </form>
    </div>
  );
}

export default FormToEditComment;