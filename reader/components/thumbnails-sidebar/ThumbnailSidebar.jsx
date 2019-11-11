import React from 'react'
import PDFThumbnailViewer from '../../lib/pdf-js/PDFThumbnailViewer'

import './ThumbnailSidebar.scss'
import { withGlobalStore } from '../../store'

class ThumbnailSidebar extends React.PureComponent {
  containerNode = null

  componentDidMount() {
    const {
      store: { document },
    } = this.props

    const { renderingQueue, linkService, documentProxy, eventBus } = document

    this.thumbnailViewer = new PDFThumbnailViewer({
      container: this.containerNode,
      linkService,
      renderingQueue,
    })

    renderingQueue.setThumbnailViewer(this.thumbnailViewer)

    // When all visible pages are rendered we want to also render thumbnails
    renderingQueue.isThumbnailViewEnabled = true

    this.thumbnailViewer.setDocument(documentProxy)

    eventBus.on('pagechanging', this.onPageChanging)
    eventBus.on('rotationchanging', this.onRotationChanging)
  }

  componentWillUnmount() {
    const {
      store: { document },
    } = this.props

    document.eventBus.off('pagechanging', this.onPageChanging)
    document.eventBus.off('rotationchanging', this.onRotationChanging)
  }

  onPageChanging = e => {
    const page = e.pageNumber
    this.thumbnailViewer.scrollThumbnailIntoView(page)
  }

  onRotationChanging = e => {
    const {
      store: { document },
    } = this.props

    const { renderingQueue, viewer } = document
    this.thumbnailViewer.pagesRotation = e.pagesRotation

    renderingQueue.renderHighestPriority()
    // Ensure that the active page doesn't change during rotation.
    viewer.currentPageNumber = e.pageNumber
  }

  render() {
    const {
      store: { ui },
    } = this.props

    return (
      <div
        ref={node => {
          this.containerNode = node
        }}
        className="thumbnails-view"
        style={{
          visibility: ui.isThumbnailSidebarVisible ? 'visible' : 'hidden',
        }}
      />
    )
  }
}

export default withGlobalStore(ThumbnailSidebar)
