import {useState} from 'react';

function FormToEditPost({post, setArbitraryUserWrapperToUpdateWallPost, setIsEditingPost, setFriendsAuthoredPostsWrapperToUpdateAuthoredPost}) {

  const [editedPostFormData, setEditedPostFormData] = useState({
    body: post.body
  });

  function changeEditedPostFormDataHandler(event) {
    setEditedPostFormData({
      ...editedPostFormData,
      [event.target.name]: event.target.value
    });
  }

  function submitEditedPostFormDataHandler(event) {
    event.preventDefault();

    fetch(`/api/posts/${post.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedPostFormData)
    })
    .then(response => {
      if (response.ok) {
        response.json().then(post => {
          if (!setFriendsAuthoredPostsWrapperToUpdateAuthoredPost) {
            setArbitraryUserWrapperToUpdateWallPost(post);
          } else {
            setFriendsAuthoredPostsWrapperToUpdateAuthoredPost(post);
          }
          setIsEditingPost(false);
        });
      }
    });
  }

  return (
    <div>
      <h1>coming from FormToEditPost.js</h1>
      <form onSubmit={submitEditedPostFormDataHandler}>
        <input
          type='text'
          name='body'
          value={editedPostFormData.body}
          onChange={changeEditedPostFormDataHandler}
        />
        <button>Save</button>
      </form>
    </div>
  );
}

export default FormToEditPost;