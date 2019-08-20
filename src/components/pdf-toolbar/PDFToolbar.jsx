import React, { useState, useEffect } from 'react'
import Icon from 'components/icons/Icon'

import './PDFToolbar.scss'

const MIN_SCALE = 0.1
const MAX_SCALE = 10.0
const DEFAULT_SCALE_DELTA = 1.1

const PDFToolbar = ({ pdfViewer, pdfEventBus }) => {
  const [, currPageChange] = useState(1)
  const [, scaleChange] = useState(0)

  const zoomIn = () => {
    let newScale = pdfViewer.currentScale
    newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2)
    newScale = Math.ceil(newScale * 10) / 10
    newScale = Math.min(MAX_SCALE, newScale)
    pdfViewer.currentScaleValue = newScale
  }

  const zoomOut = () => {
    let newScale = pdfViewer.currentScale
    newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2)
    newScale = Math.floor(newScale * 10) / 10
    newScale = Math.max(MIN_SCALE, newScale)
    pdfViewer.currentScaleValue = newScale
  }

  useEffect(() => {
    // component didMount
    const onPageChange = e => currPageChange(e.pageNumber)
    pdfEventBus.on('pagechanging', onPageChange)

    // component will unmount
    return () => pdfEventBus.off('pagechanging', onPageChange)
  }, [])

  return (
    <div className="pdf-toolbar d-flex flex-row justify-content-end align-items-center">
      <div className="pdf-preferences d-flex flex-row align-items-center justify-content-between mr-5">
        <button
          type="button"
          className="btn p-2"
          onClick={() => {
            const delta = 90
            pdfViewer.pagesRotation =
              (pdfViewer.pagesRotation + 360 + delta) % 360

            // important to rerender otherwise page becomes slightly
            // blurred until scroll event occurs
            pdfViewer.update()
          }}
        >
          <Icon iconType="rotate" />
        </button>
        <button
          type="button"
          className="btn p-2"
          disabled={pdfViewer.currentScaleValue >= MAX_SCALE}
          onClick={() => {
            zoomIn()
            scaleChange(pdfViewer.currentScaleValue)
            pdfViewer.update()
          }}
        >
          <Icon iconType="zoom-in" />
        </button>
        <button
          type="button"
          className="btn p-2"
          disabled={pdfViewer.currentScaleValue <= MIN_SCALE}
          onClick={() => {
            zoomOut()
            scaleChange(pdfViewer.currentScaleValue)
            pdfViewer.update()
          }}
        >
          <Icon iconType="zoom-out" />
        </button>
      </div>
      <div className="pdf-pagination d-flex flex-row align-items-center justify-content-between mr-5">
        <button
          type="button"
          className="btn p-2"
          disabled={pdfViewer.currentPageNumber <= 1}
          onClick={() => --pdfViewer.currentPageNumber}
        >
          <Icon iconType="left-arrow" />
        </button>
        <div>
          {pdfViewer.currentPageNumber} / {pdfViewer.pagesCount}
        </div>
        <button
          type="button"
          className="btn p-2"
          disabled={pdfViewer.currentPageNumber >= pdfViewer.pagesCount}
          onClick={() => pdfViewer.currentPageNumber++}
        >
          <Icon iconType="right-arrow" />
        </button>
      </div>
    </div>
  )
}

export default PDFToolbar
