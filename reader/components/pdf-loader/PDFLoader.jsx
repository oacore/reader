import React, { useEffect, useState, cloneElement } from 'react'
import Spinner from 'reactstrap/es/Spinner'

import pdfjs from '../../lib/pdf-js/webpack'
import { Sentry } from '../../../utils/sentry'

import './PDFLoader.scss'

const PDFLoader = React.memo(({ url, children }) => {
  const [documentProxy, setDocumentProxy] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load document on mount
  useEffect(() => {
    const loadPDFDocument = async () => {
      try {
        const document = await pdfjs.getDocument(url).promise
        setDocumentProxy(document)
      } catch (e) {
        console.error(
          `Unable to load PDF document. Redirecting to default browser view. Error: ${e}`
        )
        Sentry.captureException(e)
        if (url) setTimeout(() => window.location.replace(url), 5000)
      } finally {
        setIsLoading(false)
      }
    }
    loadPDFDocument()
  }, [])

  if (documentProxy) return cloneElement(children, { documentProxy })

  return (
    <div className="pdf-loader">
      {isLoading && <Spinner />}
      {!isLoading && (
        <div className="text-center">
          We are not allowed to display external PDFs yet. You will be
          redirected to the full text document in the repository in a few
          seconds, if not <a href={url}>click here</a>.
        </div>
      )}
    </div>
  )
})

export default PDFLoader
