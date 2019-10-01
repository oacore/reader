import React from 'react'
import SVG from 'react-inlinesvg'

import 'components/icons/Icon.scss'

import DownloadIcon from 'components/icons/assets/download.svg'
import OutlineIcon from 'components/icons/assets/outline.svg'
import ThumbnailsIcon from 'components/icons/assets/thumbnails.svg'
import PaperInfoIcon from 'components/icons/assets/paper_info.svg'
import InfoIcon from 'components/icons/assets/info.svg'
import PrintIcon from 'components/icons/assets/print.svg'
import ShareIcon from 'components/icons/assets/share.svg'
import LeftArrowIcon from 'components/icons/assets/left-arrow.svg'
import RightArrowIcon from 'components/icons/assets/right-arrow.svg'
import RotateIcon from 'components/icons/assets/rotate.svg'
import ZoomInIcon from 'components/icons/assets/zoom-in.svg'
import ZoomOutIcon from 'components/icons/assets/zoom-out.svg'

const mapNameToModule = name => {
  const iconMap = {
    download: DownloadIcon,
    outline: OutlineIcon,
    thumbnails: ThumbnailsIcon,
    paper_info: PaperInfoIcon,
    info: InfoIcon,
    print: PrintIcon,
    share: ShareIcon,
    'left-arrow': LeftArrowIcon,
    'right-arrow': RightArrowIcon,
    'zoom-in': ZoomInIcon,
    'zoom-out': ZoomOutIcon,
    rotate: RotateIcon,
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
