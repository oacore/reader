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
import PDFToolbar from 'components/pdf-toolbar/PDFToolbar'

class PDFViewer extends React.PureComponent {
  containerNode = null

  viewerNode = null

  viewer = null

  state = {
    toolbarEnabled: false,
  }

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
    this.pdfLinkService = new _PDFLinkService(this.pdfEventBus)

    // PDFViewer allows to render pages on demand,
    // i.e. page is render only when is visible
    // This PDFViewer makes animations (sidebar open/closed) much more faster.
    this.pdfViewer = new _PDFViewer({
      container: this.containerNode,
      viewer: this.viewerNode,
      enhanceTextSelection: true,
      renderingQueue: this.pdfRenderingQueue,
      eventBus: this.pdfEventBus,
      linkService: this.pdfLinkService,
    })

    this.pdfEventBus.on('pagesinit', this.onPagesInit)

    this.pdfRenderingQueue.setViewer(this.pdfViewer)
    this.pdfLinkService.setViewer(this.pdfViewer)

    this.pdfViewer.setDocument(pdfDocumentProxy)
    this.pdfLinkService.setDocument(pdfDocumentProxy)

    setPDFDocument({
      pdfLinkService: this.pdfLinkService,
      pdfRenderingQueue: this.pdfRenderingQueue,
      pdfEventBus: this.pdfEventBus,
      pdfViewer: this.pdfViewer,
    })
  }

  componentWillUnmount() {
    // unregister all event listeners
    this.pdfEventBus.off('pagesinit', this.onPagesInit)
  }

  onPagesInit = () => {
    this.pdfViewer.currentScaleValue = 'auto'
    this.setState({ toolbarEnabled: true })
  }

  // It's important to use `pdfViewer` class in inner element.
  // It allows to use custom PDF.js styles, i.e. loading animation
  // when particular PDF page is not rendered
  render() {
    const { toolbarEnabled } = this.state

    return (
      <div
        className="pdf-container"
        ref={node => {
          this.containerNode = node
        }}
      >
        <div
          ref={node => {
            this.viewerNode = node
          }}
          className="pdfViewer"
        />
        {toolbarEnabled && (
          <PDFToolbar
            pdfViewer={this.pdfViewer}
            pdfEventBus={this.pdfEventBus}
          />
        )}
      </div>
    )
  }
}

export default withAppContext(PDFViewer)
