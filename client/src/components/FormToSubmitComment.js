import {useState, forwardRef} from 'react';
import ValidationErrorMessage from './ValidationErrorMessage';

// https://react.dev/reference/react/forwardRef#usage
const FormToSubmitComment = forwardRef(function FormToSubmitComment({post, user, setPostsCommentsWrapperToAddNewComment}, ref) {

  const [commentFormData, setCommentFormData] = useState({
    author_id: user.id,
    post_id: post.id,
    body: ''
  });

  const [validationErrors, setValidationErrors] = useState(null);

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
    .then(response => {
      if (response.ok) {
        response.json().then(comment => setPostsCommentsWrapperToAddNewComment(comment));
      } else {
        response.json().then(errorData => setValidationErrors(errorData));
      }
    });

    /*
    may need to use 'setCommentFormData' setter function to clear out user input data after submit
    'HTMLFormElement.reset()' doesn't seem to work in React!
    */
    commentFormData.body = '';
  }

  return (
    <form onSubmit={submitCommentFormDataHandler} className='form-to-submit-comment'>
      <fieldset className='form-to-submit-comment-fieldset'>
        <div className='form-to-submit-comment-input'>
          <input
            ref={ref}
            type='text'
            name='body'
            placeholder='Write a comment...'
            value={commentFormData.body}
            onChange={changeCommentFormDataHandler}
          />
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
});

export default FormToSubmitComment;