import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@oacore/design'

import styles from './styles.module.css'
import { useGlobalStore } from '../../store'

const Recommender = React.memo(({ containerWidth }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [data, setData] = useState(null)
  const [{ metadata, ui }] = useGlobalStore()
  const recommenderRef = useRef(null)

  // Trigger related papers load when this component intersect the viewport
  const observer = useRef(
    'IntersectionObserver' in window &&
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            setIsVisible(true)
            observer.current.unobserve(recommenderRef.current)
          }
        })
      })
  )

  // Setup Intersection Observer
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return () => {}
    }

    if (recommenderRef.current) observer.current.observe(recommenderRef.current)

    return () => {
      observer.current.unobserve(recommenderRef.current)
    }
  }, [recommenderRef])

  // Load Data
  useEffect(() => {
    if (isVisible && data === null) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            'https://core.ac.uk/recommender/recommend',
            {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: metadata.title,
                oai: metadata.oai,
                abstract: metadata.abstract,
              }),
            }
          )
          const documents = await response.json()
          setData(documents?.generalArticles?.documents || [])
        } catch (error) {
          // most likely Recommender is down, silently ignore it
          setData([])
        }
      }
      fetchData()
    }
  }, [isVisible])

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
      }}
      ref={recommenderRef}
    >
      <h5 className="display">Related papers</h5>
      {isVisible && data !== null && (
        <ul className={styles.relatedPapers}>
          {data.slice(0, 6).map((el) => {
            const detailedInfo = []
            if (el.repositoryName)
              detailedInfo.push(`Provided by: ${el.repositoryName}`)
            if (el.publisher) detailedInfo.push(`Publisher: ${el.publisher}`)
            if (el.year) detailedInfo.push(`Year: ${el.year}`)

            return (
              <li key={el.id}>
                <img
                  alt="thumb"
                  src={`https://core.ac.uk/image/${el.id}/medium`}
                />
                <div className={styles.metadata}>
                  <div className={styles.title}>{el.title}</div>
                  <div className={styles.detailInfo}>
                    {detailedInfo.join(' | ')}
                  </div>
                  <div className={styles.authors}>
                    by {el.authors.map((a) => a.replace(',', ' ')).join(', ')}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {!isVisible && data === null && (
        <Button onClick={() => setIsVisible(true)}>Load recommendations</Button>
      )}
      {isVisible && data === null && <p>Loading recommendations</p>}
      {isVisible && data?.length === 0 && (
        <p>
          We are sorry but we were unable to find any recommendations for this
          document.
        </p>
      )}
    </div>
  )
})

export default Recommender
