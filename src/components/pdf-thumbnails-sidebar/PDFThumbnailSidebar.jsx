import React from 'react'
import PDFThumbnailViewer from 'lib/pdf-js/PDFThumbnailViewer'
import withAppContext from 'store/withAppContext'

import './PDFThumbnailSidebar.scss'

class PDFThumbnailSidebar extends React.PureComponent {
  containerNode = null

  componentDidMount() {
    const {
      context: {
        state: {
          pdfDocument: {
            pdfDocumentProxy,
            pdfLinkService,
            pdfRenderingQueue,
            pdfEventBus,
          },
        },
      },
    } = this.props

    this.thumbnailViewer = new PDFThumbnailViewer({
      container: this.containerNode,
      linkService: pdfLinkService,
      renderingQueue: pdfRenderingQueue,
    })

    pdfRenderingQueue.setThumbnailViewer(this.thumbnailViewer)

    // When all visible pages are rendered we want to also render thumbnails
    pdfRenderingQueue.isThumbnailViewEnabled = true

    this.thumbnailViewer.setDocument(pdfDocumentProxy)

    pdfEventBus.on('pagechanging', e => {
      const page = e.pageNumber
      this.thumbnailViewer.scrollThumbnailIntoView(page)
    })
  }

  componentWillUnmount() {
    const {
      context: {
        state: {
          pdfDocument: { pdfEventBus },
        },
      },
    } = this.props

    pdfEventBus.off('pagechanging')
  }

  render() {
    return (
      <div
        ref={node => {
          this.containerNode = node
        }}
        className="pdf-thumbnails-view"
      />
    )
  }
}

export default withAppContext(PDFThumbnailSidebar)
