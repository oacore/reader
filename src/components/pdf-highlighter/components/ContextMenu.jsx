import React from 'react'
import { isEmpty, noop, debounce } from 'lodash'
import withAppContext from '../../../store/withAppContext'

const HIGHLIGHTS_COLORS = ['red', 'yellow', 'green', 'blue']

class ContextMenu extends React.PureComponent {
  state = {
    isInnerVisible: true,
  }

  setAnnotationAndToggleSidebar(color) {
    const {
      state: { annotations, isEnhancementViewVisible },
      setAnnotation,
      toggleIsEnhancementViewVisible,
    } = this.props.context
    const { rects, selectedText, annotationId } = this.props
    let toggleSidebar = noop
    if (!isEnhancementViewVisible && isEmpty(annotations))
      toggleSidebar = toggleIsEnhancementViewVisible

    if (annotationId !== null) {
      setAnnotation(annotationId, {
        color,
      })
    } else {
      const annotationIndex = Object.keys(annotations).length + 1
      setAnnotation(annotationIndex, {
        color,
        rects,
        selectedText,
      })
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
    if (!this.props.context.state) return null
    const {
      state: {
        pdfDocument: { pdfViewer },
      },
    } = this.props.context
    const { left, top, height } = this.props

    // TODO: Currently annotations are available only if page is not rotated
    const isMenuVisible =
      pdfViewer.pagesRotation === 0 && this.determineVisibility()

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
          if (!this.state.isInnerVisible)
            this.setState({ isInnerVisible: true })
        }}
        onMouseLeave={debounce(() => {
          if (this.state.isInnerVisible)
            this.setState({ isInnerVisible: false })
        }, 100)}
      >
        <div className="highlight-popup">
          <div className="d-flex justify-content-between">
            {HIGHLIGHTS_COLORS.map(color => (
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

export default withAppContext(ContextMenu)
