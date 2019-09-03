import React, { useRef } from 'react'
import Header from 'components/header/Header'
import MainArea from 'components/main-area/MainArea'
import GlobalProvider from 'store/GlobalProvider'
import { PDFRenderingQueue as _PDFRenderingQueue } from 'pdfjs-dist/lib/web/pdf_rendering_queue'
import {
  EventBus as _PDFEventBus,
  PDFLinkService as _PDFLinkService,
} from 'pdfjs-dist/web/pdf_viewer'

import 'components/bootstrap/bootstrap.scss'
import PDFPrint from './components/pdf-print/PDFPrint'

const CoreReader = ({ pdfId, pdfUrl, publisher, year, additionalInfo }) => {
  // Create shared Queue for rendering pages and thumbnails
  const pdfRenderingQueue = new _PDFRenderingQueue()

  // Bus used for catching all events from PDF.js
  const pdfEventBus = new _PDFEventBus({ dispatchToDOM: false })

  // Link service allows to clicking on internal links in PDF
  const pdfLinkService = new _PDFLinkService(pdfEventBus)

  const printContainerRef = useRef()

  return (
    <GlobalProvider
      pdfRenderingQueue={pdfRenderingQueue}
      pdfEventBus={pdfEventBus}
      pdfLinkService={pdfLinkService}
      pdfId={pdfId}
      pdfUrl={pdfUrl}
      publisher={publisher}
      year={year}
      additionalInfo={additionalInfo}
      printContainerRef={printContainerRef}
    >
      <PDFPrint ref={printContainerRef} />
      <div id="pdf-viewer-container">
        <Header />
        <MainArea />
      </div>
    </GlobalProvider>
  )
}

export default CoreReader
