import React from 'react'
import { PDFViewer as _PDFViewer } from 'pdfjs-dist/web/pdf_viewer'

import 'pdfjs-dist/web/pdf_viewer.css'
import './PDFViewer.scss'
import PDFToolbar from '../pdf-toolbar/PDFToolbar'
import PDFRecommender from '../pdf-recommender/PDFRecommender'

class PDFViewer extends React.PureComponent {
  containerNode = null

  viewerNode = null

  pdfViewer = null

  state = {
    toolbarEnabled: false,
    metadataContainerWidth: null,
  }

  componentDidMount() {
    const {
      pdfLinkService,
      pdfEventBus,
      pdfRenderingQueue,
      setPDFDocument,
      pdfDocumentProxy,
    } = this.props

    // PDFViewer allows to render pages on demand,
    // i.e. page is render only when is visible
    // This PDFViewer makes animations (sidebar open/closed) much more faster.
    this.pdfViewer = new _PDFViewer({
      container: this.containerNode,
      viewer: this.viewerNode,
      enhanceTextSelection: true,
      renderingQueue: pdfRenderingQueue,
      eventBus: pdfEventBus,
      linkService: pdfLinkService,
    })

    pdfEventBus.on('pagesinit', this.onPagesInit)
    pdfEventBus.on('pagesloaded', this.onPagesLoaded)

    pdfRenderingQueue.setViewer(this.pdfViewer)
    pdfLinkService.setViewer(this.pdfViewer)

    this.pdfViewer.setDocument(pdfDocumentProxy)
    pdfLinkService.setDocument(pdfDocumentProxy)

    setPDFDocument({
      pdfViewer: this.pdfViewer,
      pdfDocumentProxy,
    })
  }

  componentWillUnmount() {
    const { pdfEventBus } = this.props

    // unregister all event listeners
    pdfEventBus.off('pagesinit', this.onPagesInit)
    pdfEventBus.off('pagesloaded', this.onPagesLoaded)
  }

  onPagesLoaded = () => {
    const { setPDFDocument } = this.props

    this.setState({
      metadataContainerWidth: this.pdfViewer.getPageView(0).width,
    })
    setPDFDocument({
      pdfPagesLoaded: true,
    })
  }

  onPagesInit = () => {
    this.pdfViewer._setScale('auto', /* no_scroll */ true)
    this.pdfViewer.update()
    this.setState({ toolbarEnabled: true })
  }

  Metadata = ({ pdfMetadata }) => {
    return (
      <div
        className="pdf-metadata d-flex justify-content-between pt-2"
        style={{
          width: this.state.metadataContainerWidth,
        }}
      >
        <div className="pdf-metadata-left" />
        <div className="pdf-metadata-right">
          {pdfMetadata.repositories.length
            ? `${pdfMetadata.repositories[0].name},`
            : ''}{' '}
          <b>{pdfMetadata.year}</b>
        </div>
      </div>
    )
  }

  // It's important to use `pdfViewer` class in inner element.
  // It allows to use custom PDF.js styles, i.e. loading animation
  // when particular PDF page is not rendered
  render() {
    const { toolbarEnabled, metadataContainerWidth } = this.state
    const { pdfMetadata, pdfEventBus } = this.props
    const { Metadata, pdfViewer } = this

    return (
      <div
        className="pdf-container"
        ref={node => {
          this.containerNode = node
        }}
      >
        {metadataContainerWidth && <Metadata pdfMetadata={pdfMetadata} />}
        <div
          ref={node => {
            this.viewerNode = node
          }}
          className="pdfViewer"
        />
        <PDFRecommender containerWidth={metadataContainerWidth} />
        {toolbarEnabled && (
          <PDFToolbar pdfViewer={pdfViewer} pdfEventBus={pdfEventBus} />
        )}
      </div>
    )
  }
}

export default PDFViewer
