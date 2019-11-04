import React, { useEffect, useState, cloneElement } from 'react'
import Spinner from 'reactstrap/es/Spinner'
import pdfjs from '../../lib/pdf-js/webpack'

import './PDFLoader.scss'

const PDFLoader = React.memo(({ url, children }) => {
  const [documentProxy, setDocumentProxy] = useState(null)

  // Load document on mount
  useEffect(() => {
    const loadPDFDocument = async () => {
      try {
        const document = await pdfjs.getDocument(url).promise
        setDocumentProxy(document)
      } catch (e) {
        // TODO: log it somewhere, e.g. Sentry
        console.error(
          `Unable to load PDF document. Redirecting to default browser view. Error: ${e}`
        )
        window.location.replace(url)
      }
    }
    loadPDFDocument()
  }, [])

  if (documentProxy) return cloneElement(children, { documentProxy })

  return (
    <div className="pdf-loader">
      <Spinner />
    </div>
  )
})

export default PDFLoader
