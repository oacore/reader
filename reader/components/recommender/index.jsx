import React, { useEffect, useState, useRef } from 'react'

import styles from './styles.module.css'
import { useGlobalStore } from '../../store'
import { setRecommenderLoaded as globalSetRecommenderLoaded } from '../../store/ui/actions'

const Recommender = ({ containerWidth }) => {
  const [{ ui }, dispatch] = useGlobalStore()
  const [recommenderLoaded, setRecommenderLoaded] = useState(false)
  const recommenderRef = useRef(null)

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

  return (
    <div
      className={styles.pdfRecommender}
      style={{
        width: containerWidth,
        visibility: recommenderLoaded ? 'visible' : 'hidden',
      }}
      ref={recommenderRef}
    >
      <h5 className="display">Related papers</h5>
    </div>
  )
}

export default Recommender
