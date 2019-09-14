import React, { cloneElement } from 'react'
import ReactDom from 'react-dom'
import debounce from 'utils/debounce'
import { getPageFromRange } from 'components/pdf-highlighter/utils/utils'
import { groupRectsByPage } from 'components/pdf-highlighter/utils/rects'
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
    },
    selectedText: '',
  }

  componentDidMount() {
    document.addEventListener('selectionchange', this.onSelectionChange)
  }

  onSelectionChange = () => {
    const selection = window.getSelection()

    // no text was selected
    // https://developer.mozilla.org/en-US/docs/Web/API/Selection/isCollapsed
    if (selection.isCollapsed) {
      this.setState({ isVisible: false })
      return
    }

    this.onAfterSelection(selection)
  }

  @debounce(250)
  onAfterSelection(selection) {
    if (selection.rangeCount <= 0) return

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

    const rectsByPage = groupRectsByPage(rects, pagesRange)
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
        top: firstRect.top - pdfRect.top,
      },
      rects: rectsByPage,
      selectedText: selection.toString(),
    })
  }

  render() {
    const {
      contextRoot,
      isVisible,
      position: { left, top },
      rects,
      selectedText,
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
          selectedText={selectedText}
        />,
        contextRoot
      )

    return (
      <>
        {contextMenu}
        {contextMenu && <Highlights />}
        {children}
      </>
    )
  }
}

export default PDFHighlighter
