import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import worldMap from '../images/world_map.png';

function Signup({setUser}) {

  const [signupFormData, setSignupFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    gender: '',
    birthdayMonth: '',
    birthdayDay: '',
    birthdayYear: ''
  });

  const history = useHistory();

  function changeSignupFormDataHandler(event) {
    setSignupFormData({
      ...signupFormData,
      [event.target.name]: event.target.value
    });
  }

  function submitSignupFormDataHandler(event) {
    event.preventDefault();

    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: signupFormData.first_name,
        last_name: signupFormData.last_name,
        email: signupFormData.email,
        password: signupFormData.password,
        gender: signupFormData.gender,
        birthday: `${signupFormData.birthdayYear}-${signupFormData.birthdayMonth}-${signupFormData.birthdayDay}`
      })
    })
    .then(response => {
      if (response.ok) {
        response.json().then(jsonData => {
          setUser(jsonData);
          history.push('/home_feed'); // automatically go to home feed page after signup
        });
      }
    });
  }

  function generateMonthOptionTags() {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return months.map(month => {
      return (
        <option key={month} value={month}>{month}</option>
      );
    });
  }

  function generateDayOptionTags() {
    const days = [];

    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }

    return days.map(day => {
      return (
        <option key={day} value={day}>{day}</option>
      );
    });
  }

  function generateYearOptionTags() {
    const dateObj = new Date();
    const currentYear = dateObj.getFullYear();
    const years = [];

    for (let i = currentYear; i >= (currentYear-100); i--) {
      years.push(i);
    }

    return years.map(year => {
      return (
        <option key={year} value={year}>{year}</option>
      );
    });
  }

  return (
    <main className='content-logged-out'>
      <div className='signup'>
        <section className='left'>
          <h2>L👀kbook helps you connect and share with the people in your life.</h2>
          <img src={worldMap} alt='' />
        </section>
        <section className='right'>
          <h2>Sign Up</h2>
          <h2>It's free and anyone can join</h2>
          <form onSubmit={submitSignupFormDataHandler} className='signup-form'>
            <div>
              <label>First Name:</label>
              <input type='text' name='first_name' value={signupFormData.first_name} onChange={changeSignupFormDataHandler} />
            </div>
            <div>
              <label>Last Name:</label>
              <input type='text' name='last_name' value={signupFormData.last_name} onChange={changeSignupFormDataHandler} />
            </div>
            <div>
              <label>Your Email:</label>
              <input type='text' name='email' value={signupFormData.email} onChange={changeSignupFormDataHandler} />
            </div>
            <div>
              <label>New Password:</label>
              <input type='password' name='password' value={signupFormData.password} onChange={changeSignupFormDataHandler} />
            </div>
            <div>
              <label>I am:</label>
              <select name='gender' onChange={changeSignupFormDataHandler}>
                <option>Select Sex:</option>
                <option value='Female'>Female</option>
                <option value='Male'>Male</option>
              </select>
            </div>
            <div>
              <label>Birthday:</label>
              <select name='birthdayMonth' onChange={changeSignupFormDataHandler}>
                <option>Month:</option>
                {generateMonthOptionTags()}
              </select>
              <select name='birthdayDay' onChange={changeSignupFormDataHandler}>
                <option>Day:</option>
                {generateDayOptionTags()}
              </select>
              <select name='birthdayYear' onChange={changeSignupFormDataHandler}>
                <option>Year:</option>
                {generateYearOptionTags()}
              </select>
            </div>
            <small>By clicking Sign Up, you agree to our Terms, Data Policy and Cookies Policy.</small>
            <button>Sign Up</button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Signup;