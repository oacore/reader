import React from 'react'

const Highlight = ({ rect: { top, left, width, height }, color, viewPort }) => {
  return (
    <section
      className={`highlight highlight-${color}`}
      style={{
        top,
        left,
        width,
        height,
        transform: `matrix(${viewPort.transform.join(',')}`,
        transformOrigin: `-${left}px -${top}px`,
      }}
    />
  )
}

export default Highlight
