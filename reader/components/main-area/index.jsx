import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import Viewer from '../viewer'
import PdfLoader from '../pdf-loader/pdf-loader'
import ThumbnailSidebar from '../thumbnails-sidebar'
import OutlineSidebar from '../outline-sidebar'
import { useGlobalStore } from '../../store'
import { setDocument } from '../../store/document/actions'
import styles from './styles.module.css'

const MainArea = () => {
  const [{ metadata, ui, document }, dispatch] = useGlobalStore()

  return (
    <div
      className={classNames.use(
        styles.mainArea,
        ui.isSidebarOpen && styles.sidebarOpen
      )}
    >
      <div className={styles.sidebar}>
        {document.documentProxy && <ThumbnailSidebar />}
        {document.documentProxy && <OutlineSidebar />}
      </div>
      <PdfLoader url={metadata.url}>
        <Viewer
          linkService={document.linkService}
          eventBus={document.eventBus}
          renderingQueue={document.renderingQueue}
          metadata={metadata}
          setDocument={(d) => dispatch(setDocument(d))}
          globalDispatch={dispatch}
        />
      </PdfLoader>
    </div>
  )
}

export default MainArea
