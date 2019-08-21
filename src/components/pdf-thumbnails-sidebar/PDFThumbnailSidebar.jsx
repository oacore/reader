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

    pdfEventBus.on('pagechanging', this.onPageChanging)
    pdfEventBus.on('rotationchanging', this.onRotationChanging)
  }

  componentWillUnmount() {
    const {
      context: {
        state: {
          pdfDocument: { pdfEventBus },
        },
      },
    } = this.props

    pdfEventBus.off('pagechanging', this.onPageChanging)
    pdfEventBus.off('rotationchanging', this.onRotationChanging)
  }

  onPageChanging = e => {
    const page = e.pageNumber
    this.thumbnailViewer.scrollThumbnailIntoView(page)
  }

  onRotationChanging = e => {
    const {
      context: {
        state: {
          pdfDocument: { pdfViewer, pdfRenderingQueue },
        },
      },
    } = this.props
    this.thumbnailViewer.pagesRotation = e.pagesRotation

    pdfRenderingQueue.renderHighestPriority()
    // Ensure that the active page doesn't change during rotation.
    pdfViewer.currentPageNumber = e.pageNumber
  }

  render() {
    const {
      context: {
        state: { isThumbnailViewVisible },
      },
    } = this.props

    return (
      <div
        ref={node => {
          this.containerNode = node
        }}
        className="pdf-thumbnails-view"
        style={{ visibility: isThumbnailViewVisible ? 'visible' : 'hidden' }}
      />
    )
  }
}

export default withAppContext(PDFThumbnailSidebar)
