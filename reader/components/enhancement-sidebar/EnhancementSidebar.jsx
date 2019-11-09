import React from 'react'
import './EnhancementSidebar.scss'
import { useGlobalStore } from '../../store'

const EnhancementSidebar = () => {
  const [{ ui, document }] = useGlobalStore()

  const sortedAnnotations = Object.keys(document.annotations)
    .map(annotationId => [annotationId, document.annotations[annotationId]])
    .sort(([, firstAnnotation], [, secondAnnotation]) => {
      const firstAnnotationId = Object.keys(firstAnnotation.rects).sort()[0]
      const secondAnnotationId = Object.keys(secondAnnotation.rects).sort()[0]

      if (firstAnnotationId < secondAnnotationId) return -1
      if (firstAnnotationId > secondAnnotationId) return 1

      const firstAnnotationsSorted = firstAnnotation.rects[firstAnnotationId]
        .map(f => [f.top, f.left])
        .sort()
      const secondAnnotationsSorted = secondAnnotation.rects[secondAnnotationId]
        .map(f => [f.top, f.left])
        .sort()

      if (firstAnnotationsSorted[0][0] < secondAnnotationsSorted[0][0])
        return -1
      if (firstAnnotationsSorted[0][0] > secondAnnotationsSorted[0][0]) return 1

      if (firstAnnotationsSorted[0][1] < secondAnnotationsSorted[0][1])
        return -1
      if (firstAnnotationsSorted[0][1] > secondAnnotationsSorted[0][1]) return 1

      return 0
    })

  return (
    <div
      className="enhancement-sidebar"
      style={{
        visibility: ui.isEnhancementSidebarVisible ? 'visible' : 'hidden',
      }}
    >
      {sortedAnnotations.map(([annotationId, annotationContent]) => (
        <div
          key={annotationId}
          className={`info-box info-box-${annotationContent.color} p-2`}
        >
          {annotationContent.selectedText}
        </div>
      ))}
    </div>
  )
}

export default EnhancementSidebar
