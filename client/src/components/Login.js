import {useState} from 'react';
import {useHistory} from 'react-router-dom';

function Login({setUser}) {

  const history = useHistory();

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
        response.json().then(jsonData => {
          setUser(jsonData);
          history.push('/home_feed'); // automatically go to home feed page after login
        });
      }
    });
  }

  return (
    <form onSubmit={submitLoginFormDataHandler} id='login-form'>
      <div>
        <label>Email</label>
        <input
          type='text'
          name='email'
          value={loginFormData.email}
          onChange={changeLoginFormDataHandler}
          id='login-email-input-field'
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type='password'
          name='password'
          value={loginFormData.password}
          onChange={changeLoginFormDataHandler}
          id='login-password-input-field'
        />
      </div>
      <button id='login-btn'>Login</button>
    </form>
  );
}

export default Login;