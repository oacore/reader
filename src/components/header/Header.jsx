import React, { useContext } from 'react'
import { Navbar } from 'reactstrap'
import Icon from 'components/icons/Icon'
import GlobalContext from 'store/configureContext'
import { downloadPDF } from 'components/pdf-downloader/PDFDownloader'

import 'components/header/Header.scss'

const Header = () => {
  const {
    state: {
      pdfDocument: { pdfDocumentProxy },
      pdfUrl,
      isThumbnailViewVisible,
      isOutlineViewVisible,
    },
    toggleIsThumbnailViewVisible,
    toggleIsOutlineViewVisible,
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
        <button type="button" className="btn p-0">
          <Icon iconType="paper_info" />
        </button>
      </div>
      <div className="item d-flex justify-content-center">
        <button type="button" className="btn p-0">
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
          onClick={() => downloadPDF(pdfDocumentProxy, pdfUrl)}
        >
          <Icon iconType="download" />
        </button>
        <button type="button" className="btn p-0 ml-3">
          <Icon iconType="print" />
        </button>
      </div>
    </Navbar>
  )
}

export default Header
