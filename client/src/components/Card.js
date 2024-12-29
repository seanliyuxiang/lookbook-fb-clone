function Card({children, rootContainerStyle}) {
  return (
    <div
      className='card'
      style={rootContainerStyle}
    >
      {children}
    </div>
  );
}

export default Card;