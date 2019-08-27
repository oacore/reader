import React, { useContext } from 'react'
import { Navbar } from 'reactstrap'
import Icon from 'components/icons/Icon'
import GlobalContext from 'store/configureContext'
import { downloadPDF } from 'components/pdf-downloader/PDFDownloader'

import 'components/header/Header.scss'
import ReactToPrint from 'react-to-print'

const Header = () => {
  const {
    state: {
      pdfDocument: { pdfDocumentProxy, pdfPagesLoaded },
      pdfMetadata,
      isThumbnailViewVisible,
      isOutlineViewVisible,
      isEnhancementViewVisible,
      printContainerRef,
    },
    toggleIsThumbnailViewVisible,
    toggleIsOutlineViewVisible,
    toggleIsEnhancementViewVisible,
  } = useContext(GlobalContext)

  return (
    <Navbar light color="light" className="header" tag="header">
      <div className="item d-flex justify-content-start">
        <button
          type="button"
          className="btn p-0 mr-3"
          onClick={toggleIsOutlineViewVisible}
        >
          <Icon iconType="outline" isActive={isOutlineViewVisible} />
        </button>
        <button
          type="button"
          className="btn p-0 mr-3"
          onClick={toggleIsThumbnailViewVisible}
        >
          <Icon iconType="thumbnails" isActive={isThumbnailViewVisible} />
        </button>
        <button
          type="button"
          className="btn p-0"
          onClick={toggleIsEnhancementViewVisible}
        >
          <Icon iconType="paper_info" isActive={isEnhancementViewVisible} />
        </button>
      </div>
      <div className="item d-flex justify-content-center">
        <button
          type="button"
          className="btn p-0"
          disabled={pdfMetadata.id === null}
          onClick={() => {
            const coreHostname = 'core.ac.uk'
            const pdfMetadataSuffix = `display/${pdfMetadata.id}`
            if (window.location.hostname === coreHostname)
              window.location.pathname = pdfMetadataSuffix
            else
              window.location = `https://${coreHostname}/${pdfMetadataSuffix}`
          }}
        >
          <Icon iconType="info" />
        </button>
      </div>
      <div className="item d-flex justify-content-end">
        <button type="button" className="btn p-0">
          <Icon iconType="share" />
        </button>
        <button
          type="button"
          className="btn p-0 ml-3"
          disabled={!pdfDocumentProxy} // pdf is not loaded yet
          onClick={() => downloadPDF(pdfDocumentProxy, pdfMetadata.url)}
        >
          <Icon iconType="download" />
        </button>
        <ReactToPrint
          trigger={() => (
            <button
              type="button"
              className="btn p-0 ml-3"
              disabled={!pdfPagesLoaded}
            >
              <Icon iconType="print" />
            </button>
          )}
          content={() => printContainerRef.current}
        />
      </div>
    </Navbar>
  )
}

export default Header
