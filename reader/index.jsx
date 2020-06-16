import React from 'react'
import { PDFRenderingQueue } from 'pdfjs-dist/lib/web/pdf_rendering_queue'
import { EventBus, PDFLinkService } from 'pdfjs-dist/es5/web/pdf_viewer'

import MainArea from './components/main-area'
import Layout from './components/layout'
import Header from './components/header'
import GlobalStore from './store'

const CoreReader = ({
  id,
  downloadUrl,
  repositories,
  year,
  abstract,
  title,
  oai,
}) => {
  // Create shared Queue for rendering pages and thumbnails
  const renderingQueue = new PDFRenderingQueue()

  // Bus used for catching all events from PDF.js
  const eventBus = new EventBus({ dispatchToDOM: false })

  // Link service allows to clicking on internal links in PDF
  const linkService = new PDFLinkService({ eventBus })

  return (
    <>
      <GlobalStore
        metadata={{
          id,
          url: downloadUrl,
          repositories,
          year,
          abstract,
          title,
          oai,
        }}
        document={{
          eventBus,
          linkService,
          renderingQueue,
        }}
      >
        <Layout id="pdf-viewer-container">
          <Header />
          <MainArea />
        </Layout>
      </GlobalStore>
    </>
  )
}

export default CoreReader
