import React from 'react'
import { sortBy } from 'lodash'
import './PDFEnhancementSidebar.scss'
import { useGlobalStore } from '../../store'

const PDFEnhancementSidebar = () => {
  const [{ ui, document }] = useGlobalStore()

  const sortedAnnotations = sortBy(document.annotations, [
    annotation => sortBy(Object.keys(annotation.rects))[0],
    annotation =>
      annotation.rects[sortBy(Object.keys(annotation.rects))[0]][0].top,
    annotation =>
      annotation.rects[sortBy(Object.keys(annotation.rects))[0]][0].left,
  ])

  return (
    <div
      className="pdf-enhancement-sidebar"
      style={{
        visibility: ui.isEnhancementSidebarVisible ? 'visible' : 'hidden',
      }}
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
