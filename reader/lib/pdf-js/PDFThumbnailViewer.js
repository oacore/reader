/* eslint-disable no-underscore-dangle */

import { PDFThumbnailViewer as _PDFThumbnailViewer } from 'pdfjs-dist/lib/web/pdf_thumbnail_viewer'
import { scrollIntoView } from 'pdfjs-dist/lib/web/ui_utils'

import PDFThumbnailView from './PDFThumbnailView'

const THUMBNAIL_SCROLL_MARGIN = -19

class PDFThumbnailViewer extends _PDFThumbnailViewer {
  constructor({
    classNameSelectionRing,
    classNameSelected,
    classNameThumbnailImage,
    classNameThumbnail,
    ...args
  }) {
    super(args)
    this.classNameSelectionRing = classNameSelectionRing
    this.classNameSelected = classNameSelected
    this.classNameThumbnailImage = classNameThumbnailImage
    this.classNameThumbnail = classNameThumbnail
  }

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
      .then((firstPage) => {
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
            classNameThumbnailImage: this.classNameThumbnailImage,
            classNameSelectionRing: this.classNameSelectionRing,
            classNameThumbnail: this.classNameThumbnail,
          })
          this._thumbnails.push(thumbnail)
        }

        // Ensure that the current thumbnail is always highlighted on load.
        const thumbnailView = this._thumbnails[this._currentPageNumber - 1]
        thumbnailView.div.classList.add(this.classNameSelected)
      })
      .catch((reason) => {
        console.error('Unable to initialize thumbnail viewer', reason)
      })
  }

  scrollThumbnailIntoView(pageNumber) {
    if (!this.pdfDocument) return

    const thumbnailView = this._thumbnails[pageNumber - 1]

    if (!thumbnailView) {
      console.error('scrollThumbnailIntoView: Invalid "pageNumber" parameter.')
      return
    }

    if (pageNumber !== this._currentPageNumber) {
      const prevThumbnailView = this._thumbnails[this._currentPageNumber - 1]
      // Remove the highlight from the previous thumbnail...
      prevThumbnailView.div.classList.remove(this.classNameSelected)
      // ... and add the highlight to the new thumbnail.
      thumbnailView.div.classList.add(this.classNameSelected)
    }
    const visibleThumbs = this._getVisibleThumbs()
    const numVisibleThumbs = visibleThumbs.views.length

    // If the thumbnail isn't currently visible, scroll it into view.
    if (numVisibleThumbs > 0) {
      const first = visibleThumbs.first.id
      // Account for only one thumbnail being visible.
      const last = numVisibleThumbs > 1 ? visibleThumbs.last.id : first

      let shouldScroll = false
      if (pageNumber <= first || pageNumber >= last) shouldScroll = true
      else {
        visibleThumbs.views.some((view) => {
          if (view.id !== pageNumber) return false

          shouldScroll = view.percent < 100
          return true
        })
      }
      if (shouldScroll)
        scrollIntoView(thumbnailView.div, { top: THUMBNAIL_SCROLL_MARGIN })
    }

    this._currentPageNumber = pageNumber
  }
}

export default PDFThumbnailViewer
