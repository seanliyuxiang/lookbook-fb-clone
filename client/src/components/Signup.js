import {useState} from 'react';

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
        response.json().then(jsonData => setUser(jsonData));
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
    <form onSubmit={submitSignupFormDataHandler}>
      <label>First Name:</label>
      <input type='text' name='first_name' value={signupFormData.first_name} onChange={changeSignupFormDataHandler} />
      <br />
      <label>Last Name:</label>
      <input type='text' name='last_name' value={signupFormData.last_name} onChange={changeSignupFormDataHandler} />
      <br />
      <label>Your Email:</label>
      <input type='text' name='email' value={signupFormData.email} onChange={changeSignupFormDataHandler} />
      <br />
      <label>New Password:</label>
      <input type='password' name='password' value={signupFormData.password} onChange={changeSignupFormDataHandler} />
      <br />
      <label>I am:</label>
      <select name='gender' onChange={changeSignupFormDataHandler}>
        <option>Select Sex:</option>
        <option value='Female'>Female</option>
        <option value='Male'>Male</option>
      </select>
      <br />
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
      <br />
      <button>Sign Up</button>
    </form>
  );
}

export default Signup;