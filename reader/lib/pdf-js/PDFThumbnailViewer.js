/* eslint-disable no-underscore-dangle */

import { PDFThumbnailViewer as _PDFThumbnailViewer } from 'pdfjs-dist/lib/web/pdf_thumbnail_viewer'

import PDFThumbnailView from './PDFThumbnailView'

const THUMBNAIL_SELECTED_CLASS = 'selected'

class PDFThumbnailViewer extends _PDFThumbnailViewer {
  // Code taken from https://github.com/mozilla/pdf.js/blob/master/web/pdf_thumbnail_viewer.js
  // Adjusted to use our custom PDFThumbnailView class
  setDocument(pdfDocument) {
    if (this.pdfDocument) {
      this._cancelRendering()
      this._resetView()
    }

    this.pdfDocument = pdfDocument
    if (!pdfDocument) return

    pdfDocument
      .getPage(1)
      .then(firstPage => {
        const pagesCount = pdfDocument.numPages
        const viewport = firstPage.getViewport({ scale: 1 })
        for (let pageNum = 1; pageNum <= pagesCount; ++pageNum) {
          const thumbnail = new PDFThumbnailView({
            container: this.container,
            id: pageNum,
            defaultViewport: viewport.clone(),
            linkService: this.linkService,
            renderingQueue: this.renderingQueue,
            disableCanvasToImageConversion: false,
            l10n: this.l10n,
          })
          this._thumbnails.push(thumbnail)
        }

        // Ensure that the current thumbnail is always highlighted on load.
        const thumbnailView = this._thumbnails[this._currentPageNumber - 1]
        thumbnailView.div.classList.add(THUMBNAIL_SELECTED_CLASS)
      })
      .catch(reason => {
        console.error('Unable to initialize thumbnail viewer', reason)
      })
  }
}

export default PDFThumbnailViewer
