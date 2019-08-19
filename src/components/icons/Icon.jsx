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
import LeftArrowIcon from 'components/icons/assests/left-arrow.svg'
import RightArrowIcon from 'components/icons/assests/right-arrow.svg'

const Icon = React.memo(({ iconType, isActive = false }) => {
  // `key` property has to be specified otherwise component
  // won't rerender when isActive changes
  // `react-inlinesvg` rerenders SVG component only
  // when value of `src` is changed
  const uniqueHash = `${iconType}.reader-icon.${isActive ? 'active' : ''}`

  switch (iconType) {
    case 'download':
      return (
        <SVG
          key={uniqueHash}
          src={DownloadIcon}
          className={`reader-icon ${isActive ? 'active' : ''}`}
        />
      )
    case 'outline':
      return (
        <SVG
          key={uniqueHash}
          src={OutlineIcon}
          className={`reader-icon ${isActive ? 'active' : ''}`}
        />
      )
    case 'thumbnails':
      return (
        <SVG
          key={uniqueHash}
          src={ThumbnailsIcon}
          className={`reader-icon ${isActive ? 'active' : ''}`}
        />
      )
    case 'paper_info':
      return (
        <SVG
          key={uniqueHash}
          src={PaperInfoIcon}
          className={`reader-icon ${isActive ? 'active' : ''}`}
        />
      )
    case 'info':
      return (
        <SVG
          key={uniqueHash}
          src={InfoIcon}
          className={`reader-icon ${isActive ? 'active' : ''}`}
        />
      )
    case 'print':
      return (
        <SVG
          key={uniqueHash}
          src={PrintIcon}
          className={`reader-icon ${isActive ? 'active' : ''}`}
        />
      )
    case 'share':
      return (
        <SVG
          key={uniqueHash}
          src={ShareIcon}
          className={`reader-icon ${isActive ? 'active' : ''}`}
        />
      )
    case 'left-arrow':
      return (
        <SVG
          key={uniqueHash}
          src={LeftArrowIcon}
          className={`reader-icon ${isActive ? 'active' : ''}`}
        />
      )

    case 'right-arrow':
      return (
        <SVG
          key={uniqueHash}
          src={RightArrowIcon}
          className={`reader-icon ${isActive ? 'active' : ''}`}
        />
      )

    default:
      return null
  }
})

export default Icon
