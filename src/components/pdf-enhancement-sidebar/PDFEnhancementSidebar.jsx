import React, { useContext } from 'react'
import './PDFEnhancementSidebar.scss'
import GlobalContext from 'store/configureContext'

const PDFEnhancementSidebar = () => {
  const {
    state: { isEnhancementViewVisible },
  } = useContext(GlobalContext)

  return (
    <div
      className="pdf-enhancement-sidebar"
      style={{ visibility: isEnhancementViewVisible ? 'visible' : 'hidden' }}
    >
      <div className="info-box info-box-1 p-2">Microsoft Academic Graph</div>
      <div className="info-box info-box-2 p-2">
        The main area of interest to us was the relation between the
        contribution measure and citation counts. The reason for this was the
        prevalence of use of citation counts in re-search evaluation.
      </div>
    </div>
  )
}

export default PDFEnhancementSidebar
