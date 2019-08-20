import React, { useState, useEffect } from 'react'
import Icon from 'components/icons/Icon'

import './PDFToolbar.scss'

const PDFToolbar = ({ pdfViewer, pdfEventBus }) => {
  const [, currPageChange] = useState(1)

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
        <button type="button" className="btn p-2" onClick={() => {}}>
          <Icon iconType="zoom-in" />
        </button>
        <button type="button" className="btn p-2" onClick={() => {}}>
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
