import {useState} from 'react';

function FormToSubmitPost({user, setFriendsPostsWrapper}) {

  const [postFormData, setPostFormData] = useState({
    author_id: user.id,
    body: ''
  });

  function changePostFormDataHandler(event) {
    setPostFormData({
      ...postFormData,
      [event.target.name]: event.target.value
    });
  }

  function submitPostFormDataHandler(event) {
    event.preventDefault();

    fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postFormData)
    })
    .then(response => response.json())
    .then(post => setFriendsPostsWrapper(post));
  }

  return (
    <form onSubmit={submitPostFormDataHandler}>
      <h1>coming from FormToSubmitPost.js</h1>
      <input
        type='text'
        name='body'
        placeholder={`What's on your mind, ${user.first_name}?`}
        value={postFormData.body}
        onChange={changePostFormDataHandler}
      />
      <button>Post</button>
    </form>
  );
}

export default FormToSubmitPost;