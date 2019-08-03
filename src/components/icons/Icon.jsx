import React from 'react'
import SVG from 'react-inlinesvg'

import 'components/icons/Icon.scss'
import DownloadIcon from 'components/icons/assests/download.svg'
import OutlineIcon from 'components/icons/assests/outline.svg'
import ThumbnailsIcon from 'components/icons/assests/thumbnails.svg'
import PaperInfoIcon from 'components/icons/assests/paper_info.svg'
import InfoIcon from 'components/icons/assests/info.svg'
import PrintIcon from 'components/icons/assests/print.svg'
import ShareIcon from 'components/icons/assests/share.svg'

const Icon = React.memo(({ iconType }) => {
  switch (iconType) {
    case 'download':
      return <SVG src={DownloadIcon} className="reader-icon" />
    case 'outline':
      return <SVG src={OutlineIcon} className="reader-icon" />
    case 'thumbnails':
      return <SVG src={ThumbnailsIcon} className="reader-icon" />
    case 'paper_info':
      return <SVG src={PaperInfoIcon} className="reader-icon" />
    case 'info':
      return <SVG src={InfoIcon} className="reader-icon" />
    case 'print':
      return <SVG src={PrintIcon} className="reader-icon" />
    case 'share':
      return <SVG src={ShareIcon} className="reader-icon" />
    default:
      return null
  }
})

export default Icon
