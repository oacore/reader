import React from 'react'
import withAppContext from 'store/withAppContext'
import {
  PDFViewer as _PDFViewer,
  PDFLinkService as _PDFLinkService,
  EventBus as _PDFEventBus,
} from 'pdfjs-dist/web/pdf_viewer'
import { PDFRenderingQueue as _PDFRenderingQueue } from 'pdfjs-dist/lib/web/pdf_rendering_queue'

import 'pdfjs-dist/web/pdf_viewer.css'
import './PDFViewer.scss'

class PDFViewer extends React.PureComponent {
  containerNode = null

  componentDidMount() {
    const {
      context: {
        state: {
          pdfDocument: { pdfDocumentProxy },
        },
        setPDFDocument,
      },
    } = this.props

    // Create shared Queue for rendering pages and thumbnails
    this.pdfRenderingQueue = new _PDFRenderingQueue()

    // Bus used for catching all events from PDF.js
    this.pdfEventBus = new _PDFEventBus({ dispatchToDOM: false })

    // Link service allows to clicking on internal links in PDF
    this.pdfLinkService = new _PDFLinkService()

    // PDFViewer allows to render pages on demand,
    // i.e. page is render only when is visible
    // This PDFViewer makes animations (sidebar open/closed) much more faster.
    this.viewer = new _PDFViewer({
      container: this.containerNode,
      enhanceTextSelection: true,
      renderingQueue: this.pdfRenderingQueue,
      eventBus: this.pdfEventBus,
      linkService: this.pdfLinkService,
    })

    this.pdfEventBus.on('pagesinit', () => {
      this.viewer.currentScaleValue = 'auto'
    })

    this.pdfRenderingQueue.setViewer(this.viewer)
    this.pdfLinkService.setViewer(this.viewer)

    this.viewer.setDocument(pdfDocumentProxy)
    this.pdfLinkService.setDocument(pdfDocumentProxy)

    setPDFDocument({
      pdfLinkService: this.pdfLinkService,
      pdfRenderingQueue: this.pdfRenderingQueue,
      pdfEventBus: this.pdfEventBus,
      pdfViewer: this.viewer,
    })
  }

  componentWillUnmount() {
    // unregister all event listeners
    this.pdfEventBus.off('pagesinit')
  }

  // It's important to use `pdfViewer` class in inner element.
  // It allows to use custom PDF.js styles, i.e. loading animation
  // when particular PDF page is not rendered
  render() {
    return (
      <div
        className="pdf-container"
        ref={node => {
          this.containerNode = node
        }}
      >
        <div className="pdfViewer" />
      </div>
    )
  }
}

export default withAppContext(PDFViewer)
