import React, { useContext } from 'react'
import { sortBy } from 'lodash'
import './PDFEnhancementSidebar.scss'
import GlobalContext from 'store/configureContext'

const PDFEnhancementSidebar = () => {
  const {
    state: { isEnhancementViewVisible, annotations },
  } = useContext(GlobalContext)

  const sortedAnnotations = sortBy(annotations, [
    annotation => sortBy(Object.keys(annotation.rects))[0],
    annotation =>
      annotation.rects[sortBy(Object.keys(annotation.rects))[0]][0].top,
    annotation =>
      annotation.rects[sortBy(Object.keys(annotation.rects))[0]][0].left,
  ])

  return (
    <div
      className="pdf-enhancement-sidebar"
      style={{ visibility: isEnhancementViewVisible ? 'visible' : 'hidden' }}
    >
      {Object.entries(sortedAnnotations).map(
        ([annotationId, annotationContent]) => (
          <div
            key={annotationId}
            className={`info-box info-box-${annotationContent.color} p-2`}
          >
            {annotationContent.selectedText}
          </div>
        )
      )}
    </div>
  )
}

export default PDFEnhancementSidebar
