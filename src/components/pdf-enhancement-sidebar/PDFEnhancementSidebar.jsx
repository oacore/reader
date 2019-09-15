import React, { useContext } from 'react'
import './PDFEnhancementSidebar.scss'
import GlobalContext from 'store/configureContext'

const PDFEnhancementSidebar = () => {
  const {
    state: { isEnhancementViewVisible, annotations },
  } = useContext(GlobalContext)

  return (
    <div
      className="pdf-enhancement-sidebar"
      style={{ visibility: isEnhancementViewVisible ? 'visible' : 'hidden' }}
    >
      {Object.entries(annotations).map(([annotationId, annotationContent]) => (
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

export default PDFEnhancementSidebar
