import React, { useContext } from 'react'
import GlobalContext from 'store/configureContext'
import { isEmpty, noop } from 'lodash'

const HIGHLIGHTS_COLORS = ['red', 'yellow', 'green', 'blue']

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
        {HIGHLIGHTS_COLORS.map(color => (
          <button
            key={color}
            className="btn p-0"
            type="button"
            onClick={() => setAnnotationAndToggleSidebar(color)}
          >
            <span className={`dot dot-${color}`} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ContextMenu
