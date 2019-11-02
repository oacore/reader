import React, { useState, useEffect } from 'react'
import Icon from '../icons/Icon'

import './PDFToolbar.scss'

const MIN_SCALE = 0.1
const MAX_SCALE = 10.0
const DEFAULT_SCALE_DELTA = 1.1

const PDFToolbar = ({ viewer, eventBus }) => {
  const [, currPageChange] = useState(1)
  const [, scaleChange] = useState(0)

  const zoomIn = () => {
    let newScale = viewer.currentScale
    newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2)
    newScale = Math.ceil(newScale * 10) / 10
    newScale = Math.min(MAX_SCALE, newScale)
    viewer.currentScaleValue = newScale
  }

  const zoomOut = () => {
    let newScale = viewer.currentScale
    newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2)
    newScale = Math.floor(newScale * 10) / 10
    newScale = Math.max(MIN_SCALE, newScale)
    viewer.currentScaleValue = newScale
  }

  useEffect(() => {
    // component didMount
    const onPageChange = e => currPageChange(e.pageNumber)
    eventBus.on('pagechanging', onPageChange)

    // component will unmount
    return () => eventBus.off('pagechanging', onPageChange)
  }, [])

  return (
    <div className="pdf-toolbar d-flex flex-row justify-content-end align-items-center">
      <div className="pdf-preferences d-flex flex-row align-items-center justify-content-between mr-5">
        <button
          title="Rotate"
          type="button"
          className="btn p-2"
          onClick={() => {
            const delta = 90
            viewer.pagesRotation = (viewer.pagesRotation + 360 + delta) % 360

            // important to rerender otherwise page becomes slightly
            // blurred until scroll event occurs
            viewer.update()
          }}
        >
          <Icon iconType="rotate" />
        </button>
        <button
          title="Zoom in"
          type="button"
          className="btn p-2"
          disabled={viewer.currentScaleValue >= MAX_SCALE}
          onClick={() => {
            zoomIn()
            scaleChange(viewer.currentScaleValue)
            viewer.update()
          }}
        >
          <Icon iconType="zoom-in" />
        </button>
        <button
          title="Zoom out"
          type="button"
          className="btn p-2"
          disabled={viewer.currentScaleValue <= MIN_SCALE}
          onClick={() => {
            zoomOut()
            scaleChange(viewer.currentScaleValue)
            viewer.update()
          }}
        >
          <Icon iconType="zoom-out" />
        </button>
      </div>
      <div className="pdf-pagination d-flex flex-row align-items-center justify-content-between mr-5">
        <button
          title="Previous page"
          type="button"
          className="btn p-2"
          disabled={viewer.currentPageNumber <= 1}
          onClick={() => --viewer.currentPageNumber}
        >
          <Icon iconType="left-arrow" />
        </button>
        <div>
          {viewer.currentPageNumber} / {viewer.pagesCount}
        </div>
        <button
          title="Next page"
          type="button"
          className="btn p-2"
          disabled={viewer.currentPageNumber >= viewer.pagesCount}
          onClick={() => viewer.currentPageNumber++}
        >
          <Icon iconType="right-arrow" />
        </button>
      </div>
    </div>
  )
}

export default PDFToolbar
