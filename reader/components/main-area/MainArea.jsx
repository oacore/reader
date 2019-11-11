import React from 'react'
import Viewer from '../viewer/Viewer'
import PDFLoader from '../pdf-loader/PDFLoader'
import ThumbnailSidebar from '../thumbnails-sidebar/ThumbnailSidebar'
import OutlineSidebar from '../outline-sidebar/OutlineSidebar'

import './MainArea.scss'
import { useGlobalStore } from '../../store'
import { setDocument } from '../../store/document/actions'

const MainArea = () => {
  const [{ metadata, ui, document }, dispatch] = useGlobalStore()

  return (
    <div className={`main-area ${ui.isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar">
        {document.documentProxy && <ThumbnailSidebar />}
        {document.documentProxy && <OutlineSidebar />}
      </div>
      <PDFLoader url={metadata.url}>
        <Viewer
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
