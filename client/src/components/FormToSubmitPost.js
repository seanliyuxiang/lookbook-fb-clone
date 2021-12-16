import {useState} from 'react';

function FormToSubmitPost({user, setFriendsPostsWrapper, setArbitraryUserWrapper}) {

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
    .then(post => {
      if (!setArbitraryUserWrapper) {
        setFriendsPostsWrapper(post);
      } else {
        setArbitraryUserWrapper(post);
      }
    });  // may need to change the 2nd `.then()` to render errors based on the response status
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