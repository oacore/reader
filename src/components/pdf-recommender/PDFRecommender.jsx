import React, { useEffect, useState } from 'react'
import load from 'little-loader'

import './PDFRecommender.scss'

const PDFRecommender = ({ containerWidth }) => {
  const [recommenderLoaded, setRecommenderLoaded] = useState(false)

  useEffect(() => {
    load('https://core.ac.uk/recommender/embed.js', () => {
      setRecommenderLoaded(true)
    })
  }, [])

  return (
    <div
      className="pdf-recommender"
      style={{
        width: containerWidth,
        display: recommenderLoaded && containerWidth ? 'visible' : 'hidden',
      }}
    >
      <h3>Related Articles</h3>
      <div id="coreRecommenderOutput" />
    </div>
  )
}

export default PDFRecommender
