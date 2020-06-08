import React from 'react'
import { Icon, Button, AppBar } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import { downloadPDF } from '../downloader'
import './styles.module.css'
import { useGlobalStore } from '../../store'
import {
  toggleOutlineSidebar,
  toggleThumbnailsSidebar,
} from '../../store/ui/actions'
import Print from '../print'

const Header = () => {
  const [{ metadata, ui, document }, dispatch] = useGlobalStore()

  const handleRedirection = () => {
    const coreHostname = 'core.ac.uk'
    const pdfSuffix = `display/${metadata.id}`
    if (window.location.hostname === coreHostname)
      window.location.pathname = pdfSuffix
    else window.location = `https://${coreHostname}/${pdfSuffix}`
  }

  return (
    <AppBar className="app-bar">
      <AppBar.Item>
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
          <Icon src="#view-grid" alt="Show thumbnails" />
        </Button>
      </AppBar.Item>
      <AppBar.Item className="item-center">
        <Button
          title="Redirect to CORE metadata page"
          disabled={metadata.id === null}
          onClick={handleRedirection}
          className="button-menu"
        >
          <Icon src="#core-symbol" alt="CORE" />
        </Button>
      </AppBar.Item>
      <AppBar.Item className="item-right">
        <Button
          title="Download document"
          disabled={!document.documentProxy} // pdf is not loaded yet
          onClick={() => downloadPDF(document.documentProxy, metadata.url)}
          className="button-menu"
        >
          <Icon src="#file-download" alt="Download document" />
        </Button>
        <Print className="button-menu" />
      </AppBar.Item>
    </AppBar>
  )
}

export default Header
