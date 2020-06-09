import React from 'react'

import PDFThumbnailViewer from '../../lib/pdf-js/PDFThumbnailViewer'
import { withGlobalStore } from '../../store'
import styles from './styles.module.css'

class ThumbnailsSidebar extends React.PureComponent {
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
      classNameSelectionRing: styles.thumbnailSelectionRing,
      classNameSelected: styles.selected,
      classNameThumbnailImage: styles.thumbnailImage,
      classNameThumbnail: styles.thumbnail,
    })

    renderingQueue.setThumbnailViewer(this.thumbnailViewer)

    // When all visible pages are rendered we want to also render thumbnails
    renderingQueue.isThumbnailViewEnabled = true

    this.thumbnailViewer.setDocument(documentProxy)

    eventBus.on('rotationchanging', this.onRotationChanging)
  }

  componentDidUpdate(prevProps) {
    const {
      store: {
        ui: { currentPageNumber },
      },
    } = this.props
    if (prevProps.store.ui.currentPageNumber !== currentPageNumber)
      this.thumbnailViewer.scrollThumbnailIntoView(currentPageNumber)
  }

  componentWillUnmount() {
    const {
      store: { document },
    } = this.props

    document.eventBus.off('rotationchanging', this.onRotationChanging)
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
        className={styles.thumbnailsView}
        style={{
          visibility: ui.isThumbnailSidebarVisible ? 'visible' : 'hidden',
        }}
      />
    )
  }
}

export default withGlobalStore(ThumbnailsSidebar)
