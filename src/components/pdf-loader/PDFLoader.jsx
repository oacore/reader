import React, { useEffect, useState, cloneElement } from 'react'
import Spinner from 'reactstrap/es/Spinner'
import pdfjs from 'pdfjs-dist/webpack'

import './PDFLoader.scss'

const PDFLoader = React.memo(({ pdfUrl, children }) => {
  const [pdfDocumentProxy, setPdfDocumentProxy] = useState(null)

  // Load document on mount
  useEffect(() => {
    const loadPDFDocument = async () => {
      setPdfDocumentProxy(await pdfjs.getDocument(pdfUrl).promise)
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
