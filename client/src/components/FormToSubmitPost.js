import {useState} from 'react';

function FormToSubmitPost({user, setFriendsAuthoredPostsWrapperToAddNewAuthoredPost, setArbitraryUserWrapperToAddNewWallPost, arbitraryUser}) {

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

    /*
    when calling the `.append` method,
    don't nest the keys under `post` because strong params is not required in the backend
    */
    const postFormDataWithImage = new FormData();
    postFormDataWithImage.append('author_id', postFormData.author_id);
    postFormDataWithImage.append('body', postFormData.body);
    postFormDataWithImage.append('recipient_id', (!arbitraryUser ? user.id : arbitraryUser.id));
    postFormDataWithImage.append('post_photo', event.target.post_photo.files[0], event.target.post_photo.value);

    fetch('/api/posts', {
      method: 'POST',
      body: postFormDataWithImage
    })
    .then(response => response.json())
    .then(post => {
      if (!setArbitraryUserWrapperToAddNewWallPost) {
        setFriendsAuthoredPostsWrapperToAddNewAuthoredPost(post);
      } else {
        setArbitraryUserWrapperToAddNewWallPost(post);
      }
    });  // may need to change the 2nd `.then()` to render errors based on the response status

    /*
    may need to use 'setPostFormData' setter function to clear out user input data after submit
    'HTMLFormElement.reset()' doesn't seem to work in React!
    */
    postFormData.body = '';
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
      <br />
      <input type='file' name='post_photo' />
      <br />
      <button>Post</button>
    </form>
  );
}

export default FormToSubmitPost;