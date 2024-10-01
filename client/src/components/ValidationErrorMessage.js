function ValidationErrorMessage({messageStr, errorStyle}) {
  return (
    <p
      className='error-validation'
      style={errorStyle}
    >
      {messageStr}
    </p>
  );
}

export default ValidationErrorMessage;