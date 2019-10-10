import React, { cloneElement } from 'react'
import ReactDom from 'react-dom'
import { getPageFromRange } from './utils/utils'
import { groupRectsByPage } from './utils/rects'
import withAppContext from '../../store/withAppContext'
import ContextMenu from './components/ContextMenu'
import { findOrCreateLayerForContextMenu } from './utils/layer'
import Highlights from './components/Highlights'

import './PDFHighlighter.scss'

class PDFHighlighter extends React.Component {
  state = {
    isVisible: false,
    contextRoot: null,
    position: {
      left: null,
      top: null,
      height: null,
    },
    annotationId: null,
    selectedText: '',
  }

  onUpdateContextMenu = partialUpdate => {
    this.setState(state => ({
      ...state,
      ...partialUpdate,
    }))
  }

  handleOnMouseUp() {
    const {
      state: {
        pdfDocument: { pdfViewer },
      },
    } = this.props.context
    const selection = window.getSelection()

    // no text was selected
    // https://developer.mozilla.org/en-US/docs/Web/API/Selection/isCollapsed
    if (
      selection.isCollapsed ||
      selection.rangeCount <= 0 ||
      pdfViewer === null
    ) {
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

    const rectsByPage = groupRectsByPage(rects, pagesRange, pdfViewer)
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
      handleOnMouseUp: this.handleOnMouseUp.bind(this),
    })

    const contextMenu =
      contextRoot &&
      ReactDom.createPortal(
        <ContextMenu
          key={selectedText}
          isVisible={isVisible}
          left={left}
          top={top}
          rects={rects}
          height={height}
          selectedText={selectedText}
          annotationId={annotationId}
          updateContextMenu={this.onUpdateContextMenu}
        />,
        contextRoot
      )

    return (
      <>
        {contextRoot && contextMenu}
        <Highlights
          updateContextMenu={this.onUpdateContextMenu}
          currentAnnotationId={annotationId}
        />
        {children}
      </>
    )
  }
}

export default withAppContext(PDFHighlighter)
