import {useState} from 'react';

function Login({setUser}) {

  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: ''
  });

  // capture form data
  function changeLoginFormDataHandler(event) {
    setLoginFormData({
      ...loginFormData,
      [event.target.name]: event.target.value
    });
  }

  // submit form data
  function submitLoginFormDataHandler(event) {
    event.preventDefault();

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginFormData)
    })
    .then(response => {
      if (response.ok) {
        response.json().then(jsonData => setUser(jsonData));
      }
    });
  }

  return (
    <form onSubmit={submitLoginFormDataHandler}>
      <div>
        <label>Email</label>
        <input
          type='text'
          name='email'
          value={loginFormData.email}
          onChange={changeLoginFormDataHandler}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type='password'
          name='password'
          value={loginFormData.password}
          onChange={changeLoginFormDataHandler}
        />
      </div>
      <button>Login</button>
    </form>
  );
}

export default Login;