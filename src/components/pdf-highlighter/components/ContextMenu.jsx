import React, { useContext } from 'react'
import GlobalContext from 'store/configureContext'
import { isEmpty, noop } from 'lodash'

const ContextMenu = ({ left, top, isVisible, rects, selectedText }) => {
  const {
    state: { annotations, isEnhancementViewVisible },
    setAnnotation,
    toggleIsEnhancementViewVisible,
  } = useContext(GlobalContext)

  const annotationIndex = Object.keys(annotations).length + 1
  const setAnnotationAndToggleSidebar = color => {
    let toggleSidebar = noop
    if (!isEnhancementViewVisible && isEmpty(annotations))
      toggleSidebar = toggleIsEnhancementViewVisible

    setAnnotation(annotationIndex, {
      color,
      rects,
      selectedText,
    })

    toggleSidebar()
  }

  // TODO: Make this in for loop and create color enum
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
          onClick={() => setAnnotationAndToggleSidebar('red')}
        >
          <span className="dot dot-red" />
        </button>
        <button
          className="btn p-0"
          type="button"
          onClick={() => setAnnotationAndToggleSidebar('yellow')}
        >
          <span className="dot dot-yellow" />
        </button>
        <button
          className="btn p-0"
          type="button"
          onClick={() => setAnnotationAndToggleSidebar('green')}
        >
          <span className="dot dot-green" />
        </button>
        <button
          className="btn p-0"
          type="button"
          onClick={() => setAnnotationAndToggleSidebar('blue')}
        >
          <span className="dot dot-blue" />
        </button>
      </div>
    </div>
  )
}

export default ContextMenu
