import React  from 'react'
import { findOrCreateLayerForContextMenu, findPageLayer } from '../utils/layer'

const Highlight = ({
  rect: { top, left, width, height },
  color,
  viewPort,
  pageNumber,
  annotationId,
  onUpdateContextMenu,
}) => {
  const contextMenuLayer = findOrCreateLayerForContextMenu(
    findPageLayer(pageNumber)
  )

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
      <section
        className={`highlight highlight-${color}`}
        style={{
          top,
          left,
          width,
          height,
          transform: `matrix(${viewPort.transform.join(',')}`,
          transformOrigin: `-${left}px -${top}px`,
          zIndex: 100,
        }}
        onMouseOver={() => {
          onUpdateContextMenu({
            isVisible: true,
            left: left * viewPort.scale,
            top: top * viewPort.scale,
            annotationId,
            width: width * viewPort.scale,
            contextRoot: contextMenuLayer,
            height: height * viewPort.scale,
          })
        }}
        onMouseLeave={() => {
          onUpdateContextMenu({
            isVisible: false,
            left: left * viewPort.scale,
            top: top * viewPort.scale,
            annotationId,
            width: width * viewPort.scale,
            contextRoot: contextMenuLayer,
            height: height * viewPort.scale,
          })
        }}
      />
    </>
  )
}

export default Highlight
