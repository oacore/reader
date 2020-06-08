import React from 'react'
import ReactToPrint from 'react-to-print'
import { Icon, Button } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import { downloadPDF } from '../downloader/Downloader'
import './Header.scss'
import { useGlobalStore } from '../../store'
import {
  toggleOutlineSidebar,
  toggleThumbnailsSidebar,
} from '../../store/ui/actions'

const Header = ({ printContainerRef }) => {
  const [{ metadata, ui, document }, dispatch] = useGlobalStore()

  const handleRedirection = () => {
    const coreHostname = 'core.ac.uk'
    const pdfSuffix = `display/${metadata.id}`
    if (window.location.hostname === coreHostname)
      window.location.pathname = pdfSuffix
    else window.location = `https://${coreHostname}/${pdfSuffix}`
  }

  return (
    <div className="header">
      <div className="item d-flex justify-content-start">
        <Button
          title="Show outline"
          onClick={() => dispatch(toggleOutlineSidebar())}
          className={classNames
            .use('button-menu', ui.isOutlineSidebarVisible && 'button-active')
            .toString()}
        >
          <Icon src="#file-document" alt="Show outline" />
        </Button>
        <Button
          title="Show thumbnails"
          onClick={() => dispatch(toggleThumbnailsSidebar())}
          className={classNames
            .use('button-menu', ui.isThumbnailSidebarVisible && 'button-active')
            .toString()}
        >
          <Icon src="#view-grid" />
        </Button>
      </div>
      <div className="item d-flex justify-content-center">
        <Button
          title="Redirect to CORE metadata page"
          disabled={metadata.id === null}
          onClick={handleRedirection}
          className="button-menu w-auto"
        >
          <Icon src="#core-symbol" alt="CORE" />
        </Button>
      </div>
      <div className="item d-flex justify-content-end">
        <Button
          title="Download document"
          disabled={!document.documentProxy} // pdf is not loaded yet
          onClick={() => downloadPDF(document.documentProxy, metadata.url)}
          className="button-menu"
        >
          <Icon src="#file-download" alt="Download document" />
        </Button>
        <ReactToPrint
          trigger={() => (
            <Button
              title="Print document"
              disabled={!document.pagesLoaded}
              className="button-menu"
            >
              <Icon src="#printer" alt="Print document" />
            </Button>
          )}
          content={() => printContainerRef.current.printContainer}
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
              height: 100%;
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
