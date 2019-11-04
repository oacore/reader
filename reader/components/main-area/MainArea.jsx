import React from 'react'
import PDFViewer from '../pdf-viewer/PDFViewer'
import PDFLoader from '../pdf-loader/PDFLoader'
import PDFThumbnailSidebar from '../pdf-thumbnails-sidebar/PDFThumbnailSidebar'
import PDFOutlineSidebar from '../pdf-outline-sidebar/PDFOutlineSidebar'

import './MainArea.scss'
import { useGlobalStore } from '../../store'
import { setDocument } from '../../store/document/actions'

const MainArea = () => {
  const [{ metadata, ui, document }, dispatch] = useGlobalStore()

  return (
    <div className={`main-area ${ui.isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar">
        {document.documentProxy && <PDFThumbnailSidebar />}
        {document.documentProxy && <PDFOutlineSidebar />}
      </div>
      <PDFLoader url={metadata.url}>
        <PDFViewer
          linkService={document.linkService}
          eventBus={document.eventBus}
          renderingQueue={document.renderingQueue}
          metadata={metadata}
          setDocument={d => dispatch(setDocument(d))}
        />
      </PDFLoader>
    </div>
  )
}

export default MainArea
