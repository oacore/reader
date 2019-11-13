import React from 'react'
import { PDFViewer as _PDFViewer } from 'pdfjs-dist/web/pdf_viewer'

import 'pdfjs-dist/web/pdf_viewer.css'
import './Viewer.scss'
import Toolbar from '../toolbar/Toolbar'
import Recommender from '../recommender/Recommender'
import { changeCurrentPageNumber } from '../../store/ui/actions'

class Viewer extends React.PureComponent {
  containerNode = null

  viewerNode = null

  pdfViewer = null

  state = {
    toolbarEnabled: false,
    metadataContainerWidth: null,
  }

  componentDidMount() {
    const {
      linkService,
      eventBus,
      renderingQueue,
      setDocument,
      documentProxy,
    } = this.props

    // PDFViewer allows to render pages on demand,
    // i.e. page is render only when is visible
    // This PDFViewer makes animations (sidebar open/closed) much more faster.
    this.pdfViewer = new _PDFViewer({
      container: this.containerNode,
      viewer: this.viewerNode,
      enhanceTextSelection: true,
      renderingQueue,
      eventBus,
      linkService,
    })

    eventBus.on('pagesinit', this.onPagesInit)
    eventBus.on('pagesloaded', this.onPagesLoaded)
    eventBus.on('pagechanging', this.onPageChanging)

    renderingQueue.setViewer(this.pdfViewer)
    linkService.setViewer(this.pdfViewer)

    this.pdfViewer.setDocument(documentProxy)
    linkService.setDocument(documentProxy)

    setDocument({
      viewer: this.pdfViewer,
      documentProxy,
    })
  }

  componentWillUnmount() {
    const { eventBus } = this.props

    // unregister all event listeners
    eventBus.off('pagesinit', this.onPagesInit)
    eventBus.off('pagesloaded', this.onPagesLoaded)
  }

  onPagesLoaded = () => {
    const { setDocument } = this.props

    this.setState({
      metadataContainerWidth: this.pdfViewer.getPageView(0).width,
    })
    setDocument({
      pagesLoaded: true,
    })
  }

  onPagesInit = () => {
    this.pdfViewer._setScale('auto', /* no_scroll */ true)
    this.pdfViewer.update()
    this.setState({ toolbarEnabled: true })
  }

  onPageChanging = e => {
    const { globalDispatch } = this.props
    globalDispatch(changeCurrentPageNumber(e.pageNumber))
  }

  Metadata = ({ metadata }) => {
    return (
      <div
        className="pdf-metadata d-flex justify-content-between pt-2"
        style={{
          width: this.state.metadataContainerWidth,
        }}
      >
        <div className="pdf-metadata-left" />
        <div className="pdf-metadata-right">
          {metadata.repositories.length
            ? `${metadata.repositories[0].name},`
            : ''}{' '}
          <b>{metadata.year}</b>
        </div>
      </div>
    )
  }

  // It's important to use `pdfViewer` class in inner element.
  // It allows to use custom PDF.js styles, i.e. loading animation
  // when particular PDF page is not rendered
  render() {
    const { toolbarEnabled, metadataContainerWidth } = this.state
    const { metadata, eventBus } = this.props
    const { Metadata, pdfViewer } = this

    return (
      <div
        className="pdf-container"
        ref={node => {
          this.containerNode = node
        }}
      >
        {metadataContainerWidth && <Metadata metadata={metadata} />}
        <div
          ref={node => {
            this.viewerNode = node
          }}
          className="pdfViewer"
        />
        {metadataContainerWidth && (
          <Recommender containerWidth={metadataContainerWidth} />
        )}
        {toolbarEnabled && <Toolbar viewer={pdfViewer} eventBus={eventBus} />}
      </div>
    )
  }
}

export default Viewer
