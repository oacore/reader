import React, { useContext } from 'react'
import GlobalContext from 'store/configureContext'

const ContextMenu = ({ left, top, isVisible, rects }) => {
  const {
    state: { annotations },
    setAnnotation,
  } = useContext(GlobalContext)

  const annotationIndex = Object.keys(annotations).length + 1

  return (
    <div
      className={`highlight-popup ${
        isVisible ? 'highlight-popup-animated' : ''
      }`}
      style={{
        visibility: isVisible ? 'visible' : 'hidden',
        position: 'relative',
        left,
        top,
      }}
    >
      <div className="d-flex justify-content-between">
        <button
          className="btn p-0"
          type="button"
          onClick={() =>
            setAnnotation(annotationIndex, { color: 'red', rects })
          }
        >
          <span className="dot dot-red" />
        </button>
        <button
          className="btn p-0"
          type="button"
          onClick={() =>
            setAnnotation(annotationIndex, { color: 'yellow', rects })
          }
        >
          <span className="dot dot-yellow" />
        </button>
        <button
          className="btn p-0"
          type="button"
          onClick={() =>
            setAnnotation(annotationIndex, { color: 'green', rects })
          }
        >
          <span className="dot dot-green" />
        </button>
        <button
          className="btn p-0"
          type="button"
          onClick={() =>
            setAnnotation(annotationIndex, { color: 'blue', rects })
          }
        >
          <span className="dot dot-blue" />
        </button>
      </div>
    </div>
  )
}

export default ContextMenu
