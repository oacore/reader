import React, { useEffect, useState, cloneElement } from 'react'
import Spinner from 'reactstrap/es/Spinner'
import pdfjs from '../../lib/pdf-js/webpack'

import './PDFLoader.scss'

const PDFLoader = React.memo(({ pdfUrl, children }) => {
  const [pdfDocumentProxy, setPdfDocumentProxy] = useState(null)

  // Load document on mount
  useEffect(() => {
    const loadPDFDocument = async () => {
      try {
        const document = await pdfjs.getDocument(pdfUrl).promise
        setPdfDocumentProxy(document)
      } catch (e) {
        // TODO: log it somewhere, e.g. Sentry
        console.error(
          `Unable to load PDF document. Redirecting to default browser view. Error: ${e}`
        )
        window.location.replace(pdfUrl)
      }
    }
    loadPDFDocument()
  }, [])

  if (pdfDocumentProxy) return cloneElement(children, { pdfDocumentProxy })

  return (
    <div className="pdf-loader">
      <Spinner />
    </div>
  )
})

export default PDFLoader
