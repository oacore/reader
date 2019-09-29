import React from 'react'
import { findOrCreateLayerForContextMenu, findPageLayer } from '../utils/layer'

const Highlight = ({
  rect: { top, left, width, height },
  color,
  viewPort,
  pageNumber,
  annotationId,
  onUpdateContextMenu,
  isContextMenuAttached,
}) => {
  const contextMenuLayer = findOrCreateLayerForContextMenu(
    findPageLayer(pageNumber)
  )

  return (
    <button
      type="button"
      className={`btn highlight highlight-${color}`}
      style={{
        top,
        left,
        width,
        height,
        transform: `matrix(${viewPort.transform.join(',')}`,
        transformOrigin: `-${left}px -${top}px`,
        zIndex: 100,
      }}
      onClick={() => {
        if (isContextMenuAttached) {
          onUpdateContextMenu({
            isVisible: true,
          })
          return
        }

        const pdfRect = contextMenuLayer.getBoundingClientRect()
        const leftScaled = left * viewPort.scale
        const topScaled = top * viewPort.scale
        const widthScaled = width * viewPort.scale
        const heightScaled = height * viewPort.scale

        onUpdateContextMenu({
          isVisible: !isContextMenuAttached,
          annotationId,
          contextRoot: contextMenuLayer,
          position: {
            left: `${((leftScaled + widthScaled / 2) * 100) / pdfRect.width}%`,
            top: `${(topScaled * 100) / pdfRect.height}%`,
            height: `${heightScaled}px`,
          },
        })
      }}
    />
  )
}

export default Highlight
