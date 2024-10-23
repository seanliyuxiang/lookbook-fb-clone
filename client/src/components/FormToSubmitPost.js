import {useState, useRef} from 'react';
import {Link} from 'react-router-dom';
import blankProfilePicture from '../images/blank_profile_picture.png';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ValidationErrorMessage from './ValidationErrorMessage';

function FormToSubmitPost({user, setFriendsAuthoredPostsWrapperToAddNewAuthoredPost, setArbitraryUserWrapperToAddNewWallPost, arbitraryUser}) {

  const [postFormData, setPostFormData] = useState({
    author_id: user.id,
    body: ''
  });

  const [fileName, setFileName] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);

  const postAttachmentFileInputRef = useRef(null);

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
    const postFormDataWithFile = new FormData();
    postFormDataWithFile.append('author_id', postFormData.author_id);
    postFormDataWithFile.append('body', postFormData.body);
    postFormDataWithFile.append('recipient_id', (!arbitraryUser ? user.id : arbitraryUser.id));
    if (event.target.post_photo.files.length > 0) { // if there is file attached
      postFormDataWithFile.append('post_photo', event.target.post_photo.files[0], event.target.post_photo.value);
    }

    fetch('/api/posts', {
      method: 'POST',
      body: postFormDataWithFile
    })
    .then(response => {
      if (response.ok) {
        response.json().then(post => {
          if (!setArbitraryUserWrapperToAddNewWallPost) {
            setFriendsAuthoredPostsWrapperToAddNewAuthoredPost(post);
          } else {
            setArbitraryUserWrapperToAddNewWallPost(post);
          }
        });
      } else {
        response.json().then(errorData => setValidationErrors(errorData));
      }
    });

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

  function changePostAttachmentFileInputHandler(event) {
    setFileName(event.target.files[0]?.name);
  }

  function openPostAttachmentFilePickerHandler() {
    postAttachmentFileInputRef.current.click();
  }

  const isButtonToPostDisabled = postFormData.body.trim() === '';

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
        <input
          ref={postAttachmentFileInputRef}
          type='file'
          name='post_photo'
          onChange={changePostAttachmentFileInputHandler}
        />
        <div className='form-to-submit-post-file'>
          <button
            type='button'
            onClick={openPostAttachmentFilePickerHandler}
          >
            <AddAPhotoIcon />
            Photo/Video
          </button>
          {fileName && <p>{fileName}</p>}
        </div>
        <div className='form-to-submit-post-submit'>
          <button
            disabled={isButtonToPostDisabled}
            style={{
              color: isButtonToPostDisabled ? '#eee' : undefined,
              backgroundColor: isButtonToPostDisabled ? 'gray' : undefined,
              cursor: isButtonToPostDisabled ? 'not-allowed' : undefined
            }}
          >
            Post to Wall
          </button>
          <span className='btn-alternative'>or <strong onClick={cancelPostFormDataHandler}>Cancel</strong></span>
        </div>
        {validationErrors && (Object.keys(validationErrors).length > 0) &&
          <ValidationErrorMessage
            messageStr={Object.values(validationErrors).flat(Infinity).join(' ')}
            errorStyle={{marginTop: '10px'}}
          />
        }
      </fieldset>
    </form>
  );
}

export default FormToSubmitPost;