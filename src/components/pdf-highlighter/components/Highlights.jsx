import React, { useContext, Fragment } from 'react'
import GlobalContext from 'store/configureContext'
import ReactDom from 'react-dom'
import Highlight from './Highlight'
import { findOrCreateLayerForHighlights, findPageLayer } from '../utils/layer'

const Highlights = ({ container }) => {
  const {
    state: { annotations },
  } = useContext(GlobalContext)

  if (container === null) return null

  const annotationsByPage = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const [annotationId, annotationContent] of Object.entries(annotations)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [pageNumber, rects] of Object.entries(annotationContent.rects)) {
      if (pageNumber in annotationsByPage) {
        annotationsByPage[pageNumber].push([
          ...annotationsByPage[pageNumber],
          ...rects.map((rect, index) => (
            <Highlight
              // eslint-disable-next-line react/no-array-index-key
              key={`${annotationId}${pageNumber}-${annotationsByPage[pageNumber]
                .length + 1}-${index}`}
              rect={rect}
              color={annotationContent.color}
            />
          )),
        ])
      } else {
        annotationsByPage[pageNumber] = [
          ...rects.map((rect, index) => (
            <Highlight
              // eslint-disable-next-line react/no-array-index-key
              key={`${annotationId}-${pageNumber}-1-${index}`}
              rect={rect}
              color={annotationContent.color}
            />
          )),
        ]
      }
    }
  }

  const portals = Object.entries(annotationsByPage).map(
    ([pageNumber, pageHighlights]) =>
      ReactDom.createPortal(
        pageHighlights,
        findOrCreateLayerForHighlights(findPageLayer(pageNumber))
      )
  )

  // eslint-disable-next-line react/no-array-index-key
  return portals.map((p, index) => <Fragment key={index}>{p}</Fragment>)
}

export default Highlights
