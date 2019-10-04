import React, { useContext } from 'react'
import PDFViewer from '../pdf-viewer/PDFViewer'
import PDFLoader from '../pdf-loader/PDFLoader'
import PDFEnhancementSidebar from '../pdf-enhancement-sidebar/PDFEnhancementSidebar'
import PDFHighlighter from '../pdf-highlighter/PDFHighlighter'
import PDFThumbnailSidebar from '../pdf-thumbnails-sidebar/PDFThumbnailSidebar'
import PDFOutlineSidebar from '../pdf-outline-sidebar/PDFOutlineSidebar'
import GlobalContext from '../../store/configureContext'

import './MainArea.scss'

const MainArea = () => {
  const {
    state: {
      pdfDocument: {
        pdfDocumentProxy,
        pdfRenderingQueue,
        pdfEventBus,
        pdfLinkService,
      },
      pdfMetadata,
    },
    isSidebarOpen,
    setPDFDocument,
  } = useContext(GlobalContext)

  return (
    <div className={`main-area ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar">
        {pdfDocumentProxy && <PDFThumbnailSidebar />}
        {pdfDocumentProxy && <PDFOutlineSidebar />}
        <PDFEnhancementSidebar />
      </div>
      <PDFLoader pdfUrl={pdfMetadata.url} pdfDocumentProxy={pdfDocumentProxy}>
        <PDFHighlighter>
          <PDFViewer
            pdfLinkService={pdfLinkService}
            pdfEventBus={pdfEventBus}
            pdfRenderingQueue={pdfRenderingQueue}
            pdfMetadata={pdfMetadata}
            setPDFDocument={setPDFDocument}
          />
        </PDFHighlighter>
      </PDFLoader>
    </div>
  )
}

export default MainArea
