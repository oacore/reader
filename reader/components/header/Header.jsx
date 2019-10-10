import React, { useContext } from 'react'
import { Button } from 'reactstrap'
import ReactToPrint from 'react-to-print'
import Icon from '../icons/Icon'
import GlobalContext from '../../store/configureContext'
import { downloadPDF } from '../pdf-downloader/PDFDownloader'
import './Header.scss'

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
    <div className="header">
      <div className="item d-flex justify-content-start">
        <Button
          color="none"
          active={isOutlineViewVisible}
          onClick={toggleIsOutlineViewVisible}
        >
          <Icon iconType="outline" />
        </Button>
        <Button
          color="none"
          active={isThumbnailViewVisible}
          onClick={toggleIsThumbnailViewVisible}
        >
          <Icon iconType="thumbnails" />
        </Button>
        <Button
          color="none"
          active={isEnhancementViewVisible}
          onClick={toggleIsEnhancementViewVisible}
        >
          <Icon iconType="paper_info" isActive={isEnhancementViewVisible} />
        </Button>
      </div>
      <div className="item d-flex justify-content-center">
        <Button
          color="none"
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
        </Button>
      </div>
      <div className="item d-flex justify-content-end">
        <Button
          color="none"
          disabled={!pdfDocumentProxy} // pdf is not loaded yet
          onClick={() => downloadPDF(pdfDocumentProxy, pdfMetadata.url)}
        >
          <Icon iconType="download" />
        </Button>
        <ReactToPrint
          trigger={() => (
            <Button color="none" disabled={!pdfPagesLoaded}>
              <Icon iconType="print" />
            </Button>
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
    </div>
  )
}

export default Header
