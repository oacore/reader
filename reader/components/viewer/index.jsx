import React, { useEffect, useRef, useState } from 'react'
import { PDFViewer as _PDFViewer } from 'pdfjs-dist/es5/web/pdf_viewer'
import { useRouter } from 'next/router'
import { DataProviderLogo } from '@oacore/design/lib/elements/logo'

import stylesMain from '../main-area/styles.module.css'
import styles from './styles.module.css'
import Toolbar from '../toolbar'
import Recommender from '../recommender'
import { changeCurrentPageNumber } from '../../store/ui/actions'
import { debounce, checkType } from '../../utils/helpers'

const Viewer = ({
  linkService,
  eventBus,
  renderingQueue,
  setDocument,
  documentProxy,
  metadata,
  members,
}) => {
  const containerNode = useRef()
  const viewerNode = useRef()
  const pdfViewer = useRef(null)
  const [toolbarEnabled, setToolbarEnabled] = useState(false)
  const [metadataContainerWidth, setMetadataContainerWidth] = useState(null)
  const [dataProvider, setDataProvider] = useState({})

  const router = useRouter()

  const handleResizeEvent = debounce(() => {
    pdfViewer.current.currentScaleValue = 'auto'
    pdfViewer.current.update()

    setMetadataContainerWidth(pdfViewer.current.getPageView(0).width)
  })

  const onPagesLoaded = () => {
    setMetadataContainerWidth(pdfViewer.current.getPageView(0).width)
    setDocument({ pagesLoaded: true })
  }

  const onPagesInit = () => {
    // eslint-disable-next-line no-underscore-dangle
    pdfViewer.current._setScale('auto', /* no_scroll */ true)
    pdfViewer.current.update()
    setToolbarEnabled(true)
  }

  const onPageChanging = (e) => {
    changeCurrentPageNumber(e.pageNumber)
  }

  useEffect(() => {
    const fetchMetadata = async (id) => {
      const t = await fetch(
        `https://api-dev.core.ac.uk/internal/data-providers/${id}`
      )
      const res = await t.json()
      setDataProvider(res)
    }
    fetchMetadata(metadata.repositories.id)
  }, [router.query?.dataId])

  useEffect(() => {
    pdfViewer.current = new _PDFViewer({
      container: containerNode.current,
      viewer: viewerNode.current,
      enhanceTextSelection: true,
      renderingQueue,
      eventBus,
      linkService,
    })

    eventBus.on('pagesinit', onPagesInit)
    eventBus.on('pagesloaded', onPagesLoaded)
    eventBus.on('pagechanging', onPageChanging)

    renderingQueue.setViewer(pdfViewer.current)
    linkService.setViewer(pdfViewer.current)

    pdfViewer.current.setDocument(documentProxy)
    linkService.setDocument(documentProxy)

    setDocument({
      viewer: pdfViewer.current,
      documentProxy,
    })

    window.addEventListener('resize', handleResizeEvent)

    return () => {
      eventBus.off('pagesinit', onPagesInit)
      eventBus.off('pagesloaded', onPagesLoaded)
      eventBus.off('pagechanging', onPageChanging)
      window.removeEventListener('resize', handleResizeEvent)
    }
  }, [])

  const memberType = checkType(dataProvider.id, members)

  const Metadata = () => (
    <div
      className={styles.pdfMetadata}
      style={{
        width: metadataContainerWidth,
      }}
    >
      <div>
        <header className={styles.header}>
          <DataProviderLogo
            alt="logo"
            imageSrc={dataProvider.logoBase64}
            size="lg"
          />
          <div className={styles.headerInfo}>
            <h5 className={styles.headerInfoCaption}>
              <a
                href="https://core.ac.uk/membership"
                target="_blank"
                rel="noreferrer"
                className={styles.headerInfoCaptionLink}
              >
                {memberType?.billing_type
                  ? `${memberType?.billing_type} member`
                  : `Not a member yet`}
              </a>
            </h5>
            <h1 className={styles.headerInfoTitle}>
              {dataProvider.institution}
            </h1>
            <span className={styles.subHeaderInfo}>
              {metadata.repositories?.name || ''}
            </span>
          </div>
        </header>
        <b>{metadata.year}</b>
      </div>
    </div>
  )

  return (
    <div className={stylesMain.pdfContainer} ref={containerNode}>
      {metadataContainerWidth && <Metadata members={members} />}
      <div ref={viewerNode} className="pdfViewer" />
      {metadataContainerWidth && (
        <Recommender containerWidth={metadataContainerWidth} />
      )}
      {toolbarEnabled && (
        <Toolbar viewer={pdfViewer.current} eventBus={eventBus} />
      )}
    </div>
  )
}

export default Viewer
