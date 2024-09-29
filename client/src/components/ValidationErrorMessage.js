function ValidationErrorMessage({messageStr}) {
  return (
    <p className='error-validation'>
      {messageStr}
    </p>
  );
}

export default ValidationErrorMessage;