import { sortBy } from 'lodash'

// TODO: allow to highlight when PDF is rotated
const normalizeToScale1 = ({ top, left, width, height }, scale) => {
  const normalizedScale = 1 / scale

  return {
    top: top * normalizedScale,
    left: left * normalizedScale,
    width: width * normalizedScale,
    height: height * normalizedScale,
  }
}

export const groupRectsByPage = (rects, pagesRange, pdfViewer) => {
  let pageNode = pagesRange.selectionStartPage.node
  let pageRect = pageNode.getBoundingClientRect()

  const shiftPage = pageRect.top

  // seems like it's already sorted but I couldn't verify it in API doc
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects
  const sortedRects = sortBy(Array.from(rects), [r => r.top])

  const rectsByPages = {}
  let pageNumber = pagesRange.selectionStartPage.number
  let pageView = pdfViewer.getPageView(Number(pageNumber) - 1)
  // eslint-disable-next-line no-restricted-syntax
  for (const rect of sortedRects) {
    if (rect.top - shiftPage > pageRect.bottom - shiftPage) {
      pageNumber++
      pageNode = pageNode.nextSibling
      pageRect = pageNode.getBoundingClientRect()
      pageView = pdfViewer.getPageView(Number(pageNumber) - 1)
    }

    // don't want to highlight whole page
    // this happens mostly when selection is between pages
    if (rect.width === pageRect.width || rect.height === pageRect.height)
      // eslint-disable-next-line no-continue
      continue

    if (pageNumber in rectsByPages) {
      rectsByPages[pageNumber].push(
        normalizeToScale1(
          {
            top: rect.top - pageRect.top,
            left: rect.left - pageRect.left,
            width: rect.width,
            height: rect.height,
          },
          pageView.viewport.scale
        )
      )
    } else {
      rectsByPages[pageNumber] = [
        normalizeToScale1(
          {
            top: rect.top - pageRect.top,
            left: rect.left - pageRect.left,
            width: rect.width,
            height: rect.height,
          },
          pageView.viewport.scale
        ),
      ]
    }
  }

  return rectsByPages
}

export default {
  groupRectsByPage,
}
