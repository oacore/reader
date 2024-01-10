import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { PDFViewer } from 'pdfjs-dist/web/pdf_viewer'

import stylesMain from '../main-area/styles.module.css'
import styles from './styles.module.css'
import Toolbar from '../toolbar'
import Recommender from '../recommender'
import { changeCurrentPageNumber } from '../../store/ui/actions'
import { checkType, debounce } from '../../utils/helpers'
import DataProviderLogo from '../logo'

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
  const pdfViewerRef = useRef(null)
  const [toolbarEnabled, setToolbarEnabled] = useState(false)
  const [metadataContainerWidth, setMetadataContainerWidth] = useState(null)

  const [dataProvider, setDataProvider] = useState({})
  const router = useRouter()

  const handleResizeEvent = debounce(() => {
    pdfViewerRef.current.currentScaleValue = 'auto'
    pdfViewerRef.current.update()

    setMetadataContainerWidth(pdfViewerRef?.current?.getPageView(0)?.width)
  })

  const onPagesLoaded = () => {
    setMetadataContainerWidth(pdfViewerRef?.current?.getPageView(0)?.width)
    setDocument({ pagesLoaded: true })
  }
  const onPagesInit = () => {
    // eslint-disable-next-line no-underscore-dangle
    pdfViewerRef.current._setScale('auto', /* no_scroll */ true)
    pdfViewerRef.current.update()
    setToolbarEnabled(true)
  }

  const onPageChanging = (e) => {
    changeCurrentPageNumber(e.pageNumber)
  }

  useEffect(() => {
    const fetchMetadata = async (id) => {
      const t = await fetch(
        `https://api.core.ac.uk/internal/data-providers/${id}`
      )
      const res = await t.json()
      setDataProvider(res)
    }
    fetchMetadata(metadata.repositories.id)
  }, [router.query?.dataId])

  useEffect(() => {
    pdfViewerRef.current = new PDFViewer({
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

    renderingQueue.setViewer(pdfViewerRef.current)
    linkService.setViewer(pdfViewerRef.current)

    pdfViewerRef.current.setDocument(documentProxy)
    linkService.setDocument(documentProxy)

    setDocument({
      viewer: pdfViewerRef.current,
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

  const checkBillingType =
    memberType?.billing_type === 'supporting' ||
    memberType?.billing_type === 'sustaining'

  return (
    <div className={stylesMain.pdfContainer} ref={containerNode}>
      {metadataContainerWidth &&
        (checkBillingType ? (
          <div className={styles.pdfMetadata}>
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
            <div className={styles.subHeader}>
              <span className={styles.subTitle}>{metadata.title}</span>
              <span className={styles.subYear}>{metadata.year}</span>
            </div>
          </div>
        ) : (
          <div
            className={styles.pdfMetadataNone}
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
        ))}
      <div ref={viewerNode} className="pdfViewer" />
      {metadataContainerWidth && (
        <Recommender containerWidth={metadataContainerWidth} />
      )}
      {toolbarEnabled && (
        <Toolbar viewer={pdfViewerRef.current} eventBus={eventBus} />
      )}
    </div>
  )
}

export default Viewer
