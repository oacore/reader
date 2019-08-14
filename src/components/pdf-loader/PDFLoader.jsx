import React, { useEffect, useContext, useMemo } from 'react'
import Spinner from 'reactstrap/es/Spinner'
import pdfjs from 'pdfjs-dist/webpack'
import GlobalContext from 'store/configureContext'

import './PDFLoader.scss'

const PDFLoader = React.memo(({ pdfUrl, children }) => {
  const context = useContext(GlobalContext)

  // Load document on mount
  useEffect(() => {
    const loadPDFDocument = async () => {
      context.setPDFUrl(pdfUrl)
      const pdfDocumentProxy = await pdfjs.getDocument(pdfUrl).promise
      context.setPDFDocument({ pdfDocumentProxy })
    }
    loadPDFDocument()
  }, [])

  return useMemo(() => {
    if (context.state.pdfDocument.pdfDocumentProxy) return children

    return (
      <div className="pdf-loader">
        <Spinner />
      </div>
    )
  }, [context.state.pdfDocument.pdfDocumentProxy])
})

export default PDFLoader
