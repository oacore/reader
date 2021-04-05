import React from 'react'
import { PDFViewer as _PDFViewer } from 'pdfjs-dist/legacy/web/pdf_viewer'

import stylesMain from '../main-area/styles.module.css'
import styles from './styles.module.css'
import Toolbar from '../toolbar'
import Recommender from '../recommender'
import { changeCurrentPageNumber } from '../../store/ui/actions'
import { debounce } from '../../utils/helpers'

class Viewer extends React.PureComponent {
  containerNode = React.createRef()

  viewerNode = React.createRef()

  pdfViewer = null

  state = {
    toolbarEnabled: false,
    metadataContainerWidth: null,
  }

  handleResizeEvent = debounce(() => {
    this.pdfViewer.currentScaleValue = 'auto'
    this.pdfViewer.update()

    this.setState({
      metadataContainerWidth: this.pdfViewer.getPageView(0).width,
    })
  })

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
      container: this.containerNode.current,
      viewer: this.viewerNode.current,
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

    window.addEventListener('resize', this.handleResizeEvent)
  }

  componentWillUnmount() {
    const { eventBus } = this.props

    // unregister all event listeners
    eventBus.off('pagesinit', this.onPagesInit)
    eventBus.off('pagesloaded', this.onPagesLoaded)

    window.removeEventListener('resize', this.handleResizeEvent)
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
    // eslint-disable-next-line no-underscore-dangle
    this.pdfViewer._setScale('auto', /* no_scroll */ true)
    this.pdfViewer.update()
    this.setState({ toolbarEnabled: true })
  }

  onPageChanging = (e) => {
    const { globalDispatch } = this.props
    globalDispatch(changeCurrentPageNumber(e.pageNumber))
  }

  Metadata = ({ metadata }) => {
    const { metadataContainerWidth } = this.state
    return (
      <div
        className={styles.pdfMetadata}
        style={{
          width: metadataContainerWidth,
        }}
      >
        <div />
        <div>
          {metadata.repositories?.name || ''}
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
      <div className={stylesMain.pdfContainer} ref={this.containerNode}>
        {metadataContainerWidth && <Metadata metadata={metadata} />}
        <div ref={this.viewerNode} className="pdfViewer" />
        {metadataContainerWidth && (
          <Recommender containerWidth={metadataContainerWidth} />
        )}
        {toolbarEnabled && <Toolbar viewer={pdfViewer} eventBus={eventBus} />}
      </div>
    )
  }
}

export default Viewer
