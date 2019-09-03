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
          content={() => {
            return printContainerRef.current.printContainer
          }}
          onBeforeGetContent={() => printContainerRef.current.onBeforePrint()}
          onAfterPrint={() => printContainerRef.current.onAfterPrint()}
          // TODO: consider to show some warning to user
          //       that print wasn't successful
          onPrintError={() => printContainerRef.current.onAfterPrint()}
          removeAfterPrint
          copyStyles={false}
          pageStyle={`
            *,
            html {
                box-sizing: border-box;
            }
            *, *:before, *:after {
                box-sizing: inherit;
            }

            @page {
             margin: 0;
             size: auto;
            }

            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              display: block;
            }

            #pdf-print-container {
              display: block;
            }

            #pdf-print-container > div {
              display: flex;
              flex-direction: column;
              min-height: 100%;
              align-items: center;
              justify-content: center;
              page-break-after:always;
              page-break-inside: avoid;
            }

            #pdf-print-container > div > img {
              max-width:100%;
              max-height:100%;
            }
          `}
        />
      </div>
    </Navbar>
  )
}

export default Header
