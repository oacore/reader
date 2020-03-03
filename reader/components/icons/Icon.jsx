import React from 'react'
import SVG from 'react-inlinesvg'

import './Icon.scss'
import DownloadIcon from './assets/download.svg'
import OutlineIcon from './assets/outline.svg'
import ThumbnailsIcon from './assets/thumbnails.svg'
import PaperInfoIcon from './assets/paper_info.svg'
import PrintIcon from './assets/print.svg'
import ShareIcon from './assets/share.svg'
import LeftArrowIcon from './assets/left-arrow.svg'
import RightArrowIcon from './assets/right-arrow.svg'
import RotateIcon from './assets/rotate.svg'
import ZoomInIcon from './assets/zoom-in.svg'
import ZoomOutIcon from './assets/zoom-out.svg'
import CoreSymbolIcon from './assets/core-symbol.svg'

const mapNameToModule = name => {
  const iconMap = {
    'core-symbol': CoreSymbolIcon,
    'download': DownloadIcon,
    'outline': OutlineIcon,
    'thumbnails': ThumbnailsIcon,
    'paper-info': PaperInfoIcon,
    'print': PrintIcon,
    'share': ShareIcon,
    'left-arrow': LeftArrowIcon,
    'right-arrow': RightArrowIcon,
    'zoom-in': ZoomInIcon,
    'zoom-out': ZoomOutIcon,
    'rotate': RotateIcon,
  }

  if (!(name in iconMap)) throw new Error(`Icon ${name} not found`)
  return iconMap[name]
}

const Icon = React.memo(({ iconType, isActive = false }) => (
  // `key` property has to be specified otherwise component
  // won't rerender when isActive changes
  // `react-inlinesvg` rerenders SVG component only
  // when value of `src` is changed
  <SVG
    key={`${iconType}.reader-icon.${isActive ? 'active' : ''}`}
    src={mapNameToModule(iconType)}
    className={`reader-icon ${isActive ? 'active' : ''}`}
  />
))

export default Icon
