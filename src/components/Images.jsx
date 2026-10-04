import React from 'react'

const Images = ({imgSrc ,imgAlt ,className}) => {
  return (
    <img className= {`${className}`}src={imgSrc} alt={imgAlt} />
  )
}

export default Images