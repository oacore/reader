import React from 'react'

import Viewer from '../viewer'
import PdfLoader from '../pdf-loader/pdf-loader'
import ThumbnailSidebar from '../thumbnails-sidebar'
import OutlineSidebar from '../outline-sidebar'
import { useGlobalStore } from '../../store'
import { setDocument } from '../../store/document/actions'

import './styles.module.scss'

const MainArea = () => {
  const [{ metadata, ui, document }, dispatch] = useGlobalStore()

  return (
    <div className={`main-area ${ui.isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar">
        {document.documentProxy && <ThumbnailSidebar />}
        {document.documentProxy && <OutlineSidebar />}
      </div>
      <PdfLoader url={metadata.url}>
        <Viewer
          linkService={document.linkService}
          eventBus={document.eventBus}
          renderingQueue={document.renderingQueue}
          metadata={metadata}
          setDocument={d => dispatch(setDocument(d))}
          globalDispatch={dispatch}
        />
      </PdfLoader>
    </div>
  )
}

export default MainArea
