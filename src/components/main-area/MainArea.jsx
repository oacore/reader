import React, { useContext } from 'react'
import PDFViewer from 'components/pdf-viewer/PDFViewer'
import PDFLoader from 'components/pdf-loader/PDFLoader'
import PDFThumbnailSidebar from 'components/pdf-thumbnails-sidebar/PDFThumbnailSidebar'
import PDFOutlineSidebar from 'components/pdf-outline-sidebar/PDFOutlineSidebar'
import GlobalContext from 'store/configureContext'

import './MainArea.scss'

const MainArea = () => {
  const {
    state: {
      pdfDocument: { pdfDocumentProxy, pdfLinkService },
    },
    isSidebarOpen,
  } = useContext(GlobalContext)

  return (
    <div className={`main-area ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar">
        {pdfDocumentProxy && pdfLinkService && <PDFThumbnailSidebar />}
        {pdfDocumentProxy && pdfLinkService && <PDFOutlineSidebar />}
      </div>
      <PDFLoader pdfUrl="https://arxiv.org/pdf/1907.11915.pdf">
        <PDFViewer />
      </PDFLoader>
    </div>
  )
}

export default MainArea
