import React, { useEffect, useState, useRef } from 'react'
import load from 'little-loader'
import './PDFRecommender.scss'
import { useGlobalStore } from '../../store'

const PDFRecommender = ({ containerWidth }) => {
  const [{ ui }] = useGlobalStore()
  const [recommenderLoaded, setRecommenderLoaded] = useState(false)
  const recommenderRef = useRef()

  useEffect(() => {
    if (ui.isRelatedPapersScrolled) {
      const offsetTop =
        recommenderRef.current.getBoundingClientRect().top +
        recommenderRef.current.parentNode.scrollTop

      recommenderRef.current.parentNode.scroll({
        left: 0,
        top: offsetTop - 1000,
        behavior: 'auto',
      })

      // needs to be within timeout otherwise events
      // get merged and everything is scrolled smoothly not only last 900px
      setTimeout(
        () =>
          recommenderRef.current.parentNode.scroll({
            left: 0,
            top: offsetTop - 200,
            behavior: 'smooth',
          }),
        50
      )
    }
  }, [ui.isRelatedPapersScrolled])

  useEffect(() => {
    localStorage.setItem('idRecommender', CORE_RECOMMENDER_API_KEY)
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
        display: recommenderLoaded ? 'visible' : 'hidden',
      }}
      ref={recommenderRef}
    >
      <h3>Related papers</h3>
      <div id="coreRecommenderOutput" />
    </div>
  )
}

export default PDFRecommender
