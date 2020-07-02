import React from 'react'

import { withGlobalStore } from '../../store'
import { toggleEnhancementSidebar } from '../../store/ui/actions'
import { setAnnotation } from '../../store/document/actions'

const HIGHLIGHTS_COLORS = ['red', 'yellow', 'green', 'blue']

class ContextMenu extends React.PureComponent {
  state = {
    isInnerVisible: true,
  }

  setAnnotationAndToggleSidebar(color) {
    const {
      store: { document, ui },
      dispatch,
    } = this.props
    const { rects, selectedText, annotationId } = this.props
    let toggleSidebar = () => {}
    if (
      !ui.isEnhancementViewVisible &&
      Object.keys(document.annotations).length === 0
    )
      toggleSidebar = () => dispatch(toggleEnhancementSidebar)

    if (annotationId !== null) {
      dispatch(
        setAnnotation({
          annotationId,
          annotationContent: {
            color,
          },
        })
      )
    } else {
      const annotationIndex = Object.keys(document.annotations).length + 1
      dispatch(
        setAnnotation({
          annotationId: annotationIndex,
          annotationContent: {
            color,
            rects,
            selectedText,
          },
        })
      )
      window.getSelection().removeAllRanges()
    }

    toggleSidebar()
  }

  determineVisibility = () => {
    const { annotationId, isVisible } = this.props
    const { isInnerVisible } = this.state

    if (annotationId === null) return isVisible
    if (isInnerVisible) return true

    return isVisible
  }

  render() {
    const {
      left,
      top,
      height,
      store: { document },
    } = this.props

    // TODO: Currently annotations are available only if page is not rotated
    const isMenuVisible =
      document.viewer.pagesRotation === 0 && this.determineVisibility()

    return (
      <div
        className={`${isMenuVisible ? 'highlight-popup-animated' : ''}`}
        style={{
          paddingBottom: height,
          visibility: isMenuVisible ? 'visible' : 'hidden',
          position: 'relative',
          left,
          top: `calc(${top} + ${height})`,
          zIndex: 500,
          display: 'inline-block',
        }}
        onMouseEnter={() => {
          const { isInnerVisible } = this.state
          if (!isInnerVisible) this.setState({ isInnerVisible })
        }}
        onMouseLeave={() => {
          const { isInnerVisible } = this.state
          if (isInnerVisible) this.setState({ isInnerVisible: false })
        }}
      >
        <div className="highlight-popup">
          <div className="d-flex justify-content-between">
            {HIGHLIGHTS_COLORS.map((color) => (
              <button
                key={color}
                className="btn p-0"
                type="button"
                onClick={() => this.setAnnotationAndToggleSidebar(color)}
              >
                <span className={`dot dot-${color}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default withGlobalStore(ContextMenu)
