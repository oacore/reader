import React, { useRef } from 'react'
import { PDFRenderingQueue } from 'pdfjs-dist/lib/web/pdf_rendering_queue'
import { EventBus, PDFLinkService } from 'pdfjs-dist/es5/web/pdf_viewer'

import Header from './components/header'
import MainArea from './components/main-area'
import Layout from './components/layout'
import './components/bootstrap/bootstrap.scss'
import Print from './components/print/Print'
import GlobalStore from './store'

const CoreReader = ({ id, downloadUrl, repositories, year }) => {
  // Create shared Queue for rendering pages and thumbnails
  const renderingQueue = new PDFRenderingQueue()

  // Bus used for catching all events from PDF.js
  const eventBus = new EventBus({ dispatchToDOM: false })

  // Link service allows to clicking on internal links in PDF
  const linkService = new PDFLinkService({ eventBus })

  const printContainerRef = useRef(null)

  return (
    <>
      <GlobalStore
        metadata={{
          id,
          url: downloadUrl,
          repositories,
          year,
        }}
        document={{
          eventBus,
          linkService,
          renderingQueue,
        }}
      >
        <Print ref={printContainerRef} />
        <Layout id="pdf-viewer-container">
          <Header printContainerRef={printContainerRef} />
          <MainArea />
        </Layout>
      </GlobalStore>
    </>
  )
}

export default CoreReader
