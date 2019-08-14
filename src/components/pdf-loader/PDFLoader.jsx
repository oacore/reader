import React, { useEffect, useContext } from 'react'
import Spinner from 'reactstrap/es/Spinner'
import pdfjs from 'pdfjs-dist/webpack'
import PropTypes from 'prop-types'
import GlobalContext from 'store/configureContext'

import './PDFLoader.scss'

/**
 * Load PDF when this component is inserted into the DOM
 */
const PDFLoader = ({ pdfUrl, children }) => {
  const context = useContext(GlobalContext)

  // Load document on mount
  useEffect(() => {
    const loadPDFDocument = async () => {
      const pdfDocument = await pdfjs.getDocument(pdfUrl).promise
      context.setPDFDocument(pdfDocument)
    }
    loadPDFDocument()
  }, [])

  if (context.state.pdfDocument) return children

  return (
    <div className="pdf-loader">
      <Spinner />
    </div>
  )
}

PDFLoader.propTypes = {
  pdfUrl: PropTypes.string.isRequired,
}

export default PDFLoader
