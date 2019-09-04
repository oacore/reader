import React, { useEffect, useState } from 'react'
import load from 'little-loader'

import './PDFRecommender.scss'

const PDFRecommender = ({ containerWidth }) => {
  const [recommenderLoaded, setRecommenderLoaded] = useState(false)

  useEffect(() => {
    // TODO: It has to be set in local storage. This is not a very secure way.
    //  We should find another way I believe.
    localStorage.setItem('idRecommender', 'ffffff')
    localStorage.setItem('userInput', '{}')

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
