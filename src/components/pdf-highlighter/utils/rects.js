import { sortBy } from 'lodash'

export const groupRectsByPage = (rects, pagesRange) => {
  let pageNode = pagesRange.selectionStartPage.node
  let pageRect = pageNode.getBoundingClientRect()

  const shiftPage = pageRect.top

  // seems like it's already sorted but I couldn't verify it in API doc
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects
  const sortedRects = sortBy(Array.from(rects), [r => r.top])

  const rectsByPages = {}
  let pageNumber = pagesRange.selectionStartPage.number

  // eslint-disable-next-line no-restricted-syntax
  for (const rect of sortedRects) {
    if (rect.top - shiftPage > pageRect.bottom - shiftPage) {
      pageNumber++
      pageNode = pageNode.nextSibling
      pageRect = pageNode.getBoundingClientRect()
    }

    // don't want to highlight whole page
    // this happens mostly when selection is between pages
    if (rect.width === pageRect.width || rect.height === pageRect.height)
      // eslint-disable-next-line no-continue
      continue

    if (pageNumber in rectsByPages) {
      rectsByPages[pageNumber].push({
        top: rect.top - pageRect.top,
        left: rect.left - pageRect.left,
        width: rect.width,
        height: rect.height,
      })
    } else {
      rectsByPages[pageNumber] = [
        {
          top: rect.top - pageRect.top,
          left: rect.left - pageRect.left,
          width: rect.width,
          height: rect.height,
        },
      ]
    }
  }

  return rectsByPages
}

export default {
  groupRectsByPage,
}
