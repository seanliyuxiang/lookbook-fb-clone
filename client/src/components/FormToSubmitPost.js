import {useState} from 'react';
import {Link} from 'react-router-dom';
import blankProfilePicture from '../images/blank_profile_picture.png';

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
    if (event.target.post_photo.files.length > 0) { // if there is file attached
      postFormDataWithImage.append('post_photo', event.target.post_photo.files[0], event.target.post_photo.value);
    }

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

  function cancelPostFormDataHandler() {
    setPostFormData({
      ...postFormData,
      body: ''
    });
  }

  return (
    <form onSubmit={submitPostFormDataHandler} className='form-to-submit-post'>
      <Link to={`/users/${user.id}`} title={user.first_name} className='thumb'>
        <img
          src={!user.profile_picture_url ? blankProfilePicture : user.profile_picture_url}
          alt=''
        />
      </Link>
      <fieldset className='form-to-submit-post-fieldset'>
        <div className='form-to-submit-post-input'>
          <input
            type='text'
            name='body'
            placeholder={
              setFriendsAuthoredPostsWrapperToAddNewAuthoredPost !== undefined ?
                `What's on your mind, ${user.first_name}?`
              : (arbitraryUser.id === user.id ? `What's on your mind?` : `Write something to ${arbitraryUser.first_name}...`)
            }
            value={postFormData.body}
            onChange={changePostFormDataHandler}
          />
        </div>
        {/* file input is currently not set up as controlled form,
        need to change it in the future if want to have image preview */}
        <input type='file' name='post_photo' />
        <div className='form-to-submit-post-submit'>
          <button>Post to Wall</button>
          <span className='btn-alternative'>or <strong onClick={cancelPostFormDataHandler}>Cancel</strong></span>
        </div>
      </fieldset>
    </form>
  );
}

export default FormToSubmitPost;