import React, { useRef } from 'react'
import Header from 'components/header/Header'
import MainArea from 'components/main-area/MainArea'
import GlobalProvider from 'store/GlobalProvider'
import { PDFRenderingQueue as _PDFRenderingQueue } from 'pdfjs-dist/lib/web/pdf_rendering_queue'
import {
  EventBus as _PDFEventBus,
  PDFLinkService as _PDFLinkService,
} from 'pdfjs-dist/web/pdf_viewer'
import { Helmet } from 'react-helmet'

import 'components/bootstrap/bootstrap.scss'
import PDFPrint from './components/pdf-print/PDFPrint'

const CoreReader = ({
  pdfId,
  pdfUrl,
  pdfTitle,
  pdfAbstract,
  publisher,
  year,
  additionalInfo,
  authors,
  identifier,
  subject,
}) => {
  // Create shared Queue for rendering pages and thumbnails
  const pdfRenderingQueue = new _PDFRenderingQueue()

  // Bus used for catching all events from PDF.js
  const pdfEventBus = new _PDFEventBus({ dispatchToDOM: false })

  // Link service allows to clicking on internal links in PDF
  const pdfLinkService = new _PDFLinkService(pdfEventBus)

  const printContainerRef = useRef()

  return (
    <>
      <Helmet>
        <title>{pdfTitle} - CORE Reader</title>

        <meta name="DC.format" content={pdfUrl} />
        <meta name="citation_pdf_url" content={pdfUrl} />

        <meta name="DC.title" content={pdfTitle} />
        <meta name="citation_title" content={pdfTitle} />
        <meta name="DCTERMS.abstract" content={pdfAbstract} />

        {authors.map(author => (
          <meta key={author} name="citation_author" content={author} />
        ))}
        {authors.map(author => (
          <meta key={author} name="DC.creator" content={author} />
        ))}

        <meta name="citation_publication_date" content={year} />
        <meta name="DC.issued" content={year} />

        <meta name="DC.identifier" content={identifier} />
        <meta name="DC.subject" content={subject} />
      </Helmet>
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
    </>
  )
}

export default CoreReader
