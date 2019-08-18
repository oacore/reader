import React from 'react'
import { PDFOutlineViewer as _PDFOutlineViewer } from 'pdfjs-dist/lib/web/pdf_outline_viewer'
import withAppContext from 'store/withAppContext'

import './PDFOutlineSidebar.scss'

class PDFOutlineSidebar extends React.PureComponent {
  containerNode = null

  componentDidMount() {
    const {
      context: {
        state: {
          pdfDocument: { pdfDocumentProxy, pdfLinkService, pdfEventBus },
        },
      },
    } = this.props

    this.pdfOutlineViewer = new _PDFOutlineViewer({
      container: this.containerNode,
      eventBus: pdfEventBus,
      linkService: pdfLinkService,
    })

    pdfDocumentProxy.getOutline().then(outline => {
      this.pdfOutlineViewer.render({ outline })
    })
  }

  render() {
    const {
      context: {
        state: { isOutlineViewVisible },
      },
    } = this.props

    return (
      <div
        ref={node => {
          this.containerNode = node
        }}
        className="pdf-outline-view"
        style={{ visibility: isOutlineViewVisible ? 'visible' : 'hidden' }}
      />
    )
  }
}

export default withAppContext(PDFOutlineSidebar)
