import React from 'react'

const Highlight = ({ rect: { top, left, width, height }, color }) => {
  return (
    <div
      style={{
        top,
        left,
        width,
        height,
        position: 'absolute',
        backgroundColor: color,
      }}
    />
  )
}

export default Highlight
