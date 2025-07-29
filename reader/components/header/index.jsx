import React from 'react'
import { Icon, Button, AppBar } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import { DownloadFile } from '../downloader'
import styles from './styles.module.css'
import { useGlobalStore } from '../../store'
import {
  toggleOutlineSidebar,
  toggleThumbnailsSidebar,
} from '../../store/ui/actions'
import Print from '../print'
import { logEvent } from '../../../utils/analytics'

const Header = () => {
  const [{ metadata, ui, document }, dispatch] = useGlobalStore()

  const handleRedirection = () => {
    const coreHostname = 'core.ac.uk'
    const pdfSuffix = `display/${metadata.id}`
    if (window.location.hostname === coreHostname)
      window.location.pathname = pdfSuffix
    else window.location = `https://${coreHostname}/${pdfSuffix}`
  }

  // eslint-disable-next-line no-console
  console.log(process.env.ICONS_PUBLIC_PATH, 'process.env.ICONS_PUBLIC_PATH')
  // eslint-disable-next-line no-console
  console.log(process.env.BUILD_TARGET, 'aws')
  // eslint-disable-next-line no-console
  console.log(process.env.NODE_ENV, 'env')

  return (
    <AppBar className={styles.appBar}>
      <AppBar.Item>
        <Button
          title="Show outline"
          onClick={() => {
            dispatch(toggleOutlineSidebar())
            logEvent({
              category: 'app bar',
              action: 'show outline',
            })
          }}
          className={classNames.use(
            styles.buttonMenu,
            ui.isOutlineSidebarVisible && styles.buttonActive
          )}
        >
          <Icon src="#file-document" alt="Show outline" />
        </Button>
        <Button
          title="Show thumbnails"
          onClick={() => {
            dispatch(toggleThumbnailsSidebar())
            logEvent({
              category: 'app bar',
              action: 'show thumbnails',
            })
          }}
          className={classNames.use(
            styles.buttonMenu,
            ui.isThumbnailSidebarVisible && styles.buttonActive
          )}
        >
          <Icon src="#view-grid" alt="Show thumbnails" />
        </Button>
      </AppBar.Item>
      <AppBar.Item className={styles.itemCenter}>
        <Button
          title="Redirect to CORE metadata page"
          disabled={metadata.id === null}
          onClick={handleRedirection}
          className={styles.buttonMenu}
        >
          <Icon src="#core-symbol" alt="CORE" />
        </Button>
      </AppBar.Item>
      <AppBar.Item className={styles.itemRight}>
        <DownloadFile
          document={document}
          url={metadata.url}
          className={styles.buttonMenu}
        />
        <Print className={styles.buttonMenu} />
      </AppBar.Item>
    </AppBar>
  )
}

export default Header
