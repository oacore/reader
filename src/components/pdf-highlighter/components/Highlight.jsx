import React from 'react'

const Highlight = ({ rect: { top, left, width, height }, color }) => {
  return (
    <div
      className={`highlight highlight-${color}`}
      style={{
        top,
        left,
        width,
        height,
        position: 'absolute',
      }}
    />
  )
}

export default Highlight
