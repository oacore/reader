import React, { cloneElement } from 'react'
import ReactDom from 'react-dom'
import throttle from '../../utils/throttle'
import { getPageFromRange } from './utils/utils'
import { groupRectsByPage } from './utils/rects'
import ContextMenu from './components/ContextMenu'
import { findOrCreateLayerForContextMenu } from './utils/layer'
import Highlights from './components/Highlights'

import './PDFHighlighter.scss'
import { withGlobalStore } from '../../store'

class PDFHighlighter extends React.Component {
  state = {
    isVisible: false,
    contextRoot: null,
    position: {
      left: null,
      top: null,
    },
    annotationId: null,
    selectedText: '',
  }

  componentDidMount() {
    document.addEventListener('selectionchange', this.onSelectionChange)
    document.addEventListener('mouseup', this.onAfterSelection.bind(this))
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onAfterSelection)
  }

  onSelectionChange = () => {
    const selection = window.getSelection()

    // no text was selected
    // https://developer.mozilla.org/en-US/docs/Web/API/Selection/isCollapsed
    if (selection.isCollapsed) {
      this.setState({
        isVisible: false,
      })
    }
  }

  @throttle(250)
  onAfterSelection() {
    const {
      document: { viewer },
    } = this.props.store
    const selection = window.getSelection()

    // no text was selected
    // https://developer.mozilla.org/en-US/docs/Web/API/Selection/isCollapsed
    if (selection.isCollapsed || selection.rangeCount <= 0 || viewer === null) {
      this.setState({ isVisible: false })
      return
    }

    let rects = []
    for (let i = 0; i < selection.rangeCount; i++) {
      const range = selection.getRangeAt(i)
      rects = [...rects, ...range.getClientRects()]
    }

    const pagesRange = getPageFromRange({
      startContainer: selection.getRangeAt(0).startContainer,
      endContainer: selection.getRangeAt(selection.rangeCount - 1).endContainer,
    })

    if (!pagesRange.selectionStartPage || !pagesRange.selectionEndPage) return

    const rectsByPage = groupRectsByPage(rects, pagesRange, viewer)
    const firstRect = rects[0]
    const pdfRect = pagesRange.selectionStartPage.node.getBoundingClientRect()

    this.setState({
      isVisible: true,
      contextRoot: findOrCreateLayerForContextMenu(
        pagesRange.selectionStartPage.node
      ),
      position: {
        left: `${((firstRect.left - pdfRect.left + firstRect.width / 2) * 100) /
          pagesRange.selectionStartPage.node.children[0].offsetWidth}%`,
        top: `${firstRect.top - pdfRect.top}px`,
        height: `${firstRect.height}px`,
      },
      rects: rectsByPage,
      selectedText: selection.toString(),
      annotationId: null,
    })
  }

  onUpdateContextMenu = ({
    isVisible,
    left,
    top,
    annotationId,
    contextRoot,
    width,
    height,
  }) => {
    const pdfRect = contextRoot.getBoundingClientRect()
    this.setState({
      isVisible,
      position: {
        left: `${((left + width / 2) * 100) / pdfRect.width}%`,
        top: `${(top * 100) / pdfRect.height}%`,
        height: `${height}px`,
      },
      annotationId,
      contextRoot,
    })
  }

  render() {
    const {
      contextRoot,
      isVisible,
      position: { left, top, height },
      rects,
      selectedText,
      annotationId,
    } = this.state

    const children = cloneElement(this.props.children, {
      ...this.props,
    })

    const contextMenu =
      contextRoot &&
      ReactDom.createPortal(
        <ContextMenu
          isVisible={isVisible}
          left={left}
          top={top}
          rects={rects}
          height={height}
          selectedText={selectedText}
          annotationId={annotationId}
        />,
        contextRoot
      )

    return (
      <>
        {contextRoot && contextMenu}
        <Highlights updateContextMenu={this.onUpdateContextMenu} />
        {children}
      </>
    )
  }
}

export default withGlobalStore(PDFHighlighter)
