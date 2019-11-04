import React, { useRef } from 'react'
import { PDFRenderingQueue } from 'pdfjs-dist/lib/web/pdf_rendering_queue'
import { EventBus, PDFLinkService } from 'pdfjs-dist/web/pdf_viewer'
import Head from 'next/head'
import Header from './components/header/Header'
import MainArea from './components/main-area/MainArea'
import Layout from './components/layout'
import './components/bootstrap/bootstrap.scss'
import PDFPrint from './components/pdf-print/PDFPrint'
import GlobalStore from './store'

const CoreReader = ({
  id,
  downloadUrl,
  title,
  description,
  repositories,
  year,
  authors,
  oai,
  subjects,
}) => {
  // Create shared Queue for rendering pages and thumbnails
  const renderingQueue = new PDFRenderingQueue()

  // Bus used for catching all events from PDF.js
  const eventBus = new EventBus({ dispatchToDOM: false })

  // Link service allows to clicking on internal links in PDF
  const linkService = new PDFLinkService(eventBus)

  const printContainerRef = useRef()

  return (
    <>
      <Head>
        <title>{title} - CORE Reader</title>

        <meta name="DC.format" content={downloadUrl} />
        <meta name="citation_pdf_url" content={downloadUrl} />

        <meta name="DC.title" content={title} />
        <meta name="citation_title" content={title} />
        <meta name="DCTERMS.abstract" content={description} />

        {authors.map(author => (
          <meta key={author} name="citation_author" content={author} />
        ))}
        {authors.map(author => (
          <meta key={author} name="DC.creator" content={author} />
        ))}

        <meta name="citation_publication_date" content={year} />
        <meta name="DC.issued" content={year} />

        <meta name="DC.identifier" content={oai} />
        {subjects.map(subject => (
          <meta key={subject} name="DC.subject" content={subject} />
        ))}

        <style>
          {`
            html,
            body,
            #__next {
              margin: 0;
              height: 100%;
            }
          `}
        </style>
      </Head>
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
        <PDFPrint ref={printContainerRef} />
        <Layout id="pdf-viewer-container">
          <Header printContainerRef={printContainerRef} />
          <MainArea />
        </Layout>
      </GlobalStore>
    </>
  )
}

export default CoreReader
