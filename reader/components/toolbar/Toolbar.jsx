import React, { useState, useEffect, useRef } from 'react'
import Icon from '../icons/Icon'
import './Toolbar.scss'
import { useGlobalStore } from '../../store'
import {
  scrollToRelatedPapers,
  unsetRelatedPapers,
} from '../../store/ui/actions'

const MIN_SCALE = 0.1
const MAX_SCALE = 10.0
const DEFAULT_SCALE_DELTA = 1.1

const Toolbar = ({ viewer, eventBus }) => {
  const [{ ui }, dispatch] = useGlobalStore()
  const [readPosition, setReadPosition] = useState(0)
  const [relatedPapersClicked, setRelatedPapersClicked] = useState(null)
  const [isVisible, changeVisibility] = useState(false)
  const [, currPageChange] = useState(1)
  const [, scaleChange] = useState(0)
  const [inputNumber, changeInputNumber] = useState(1)

  const toolbarRef = useRef()

  const zoomIn = () => {
    let newScale = viewer.currentScale
    newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2)
    newScale = Math.ceil(newScale * 10) / 10
    newScale = Math.min(MAX_SCALE, newScale)
    viewer.currentScaleValue = newScale
  }

  const zoomOut = () => {
    let newScale = viewer.currentScale
    newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2)
    newScale = Math.floor(newScale * 10) / 10
    newScale = Math.max(MIN_SCALE, newScale)
    viewer.currentScaleValue = newScale
  }

  useEffect(() => {
    // component didMount
    const setTimeoutVisibility = () =>
      setTimeout(() => {
        changeVisibility(false)
      }, 1000)

    let timeoutId

    const onPageChange = e => {
      if (ui.isRelatedPapersScrolled && timeoutId)
        dispatch(unsetRelatedPapers())
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeoutVisibility()
      changeVisibility(true)

      currPageChange(e.pageNumber)
    }
    eventBus.on('pagechanging', onPageChange)

    // component will unmount
    return () => eventBus.off('pagechanging', onPageChange)
  }, [])

  useEffect(() => {
    if (relatedPapersClicked === null) return

    if (relatedPapersClicked) {
      setReadPosition(toolbarRef.current.parentNode.scrollTop)
      dispatch(scrollToRelatedPapers())
    } else {
      toolbarRef.current.parentNode.scroll({
        left: 0,
        top: readPosition + 1000,
        behavior: 'auto',
      })

      // needs to be within timeout otherwise events
      // get merged and everything is scrolled smoothly not only last 900px
      setTimeout(
        () =>
          toolbarRef.current.parentNode.scroll({
            left: 0,
            top: readPosition,
            behavior: 'smooth',
          }),
        50
      )
      dispatch(unsetRelatedPapers())
    }
  }, [relatedPapersClicked])

  return (
    <div
      className={`pdf-toolbar d-flex flex-wrap justify-content-end align-items-center ${
        isVisible ? 'pdf-toolbar-visible' : ''
      }`}
      ref={toolbarRef}
    >
      <div className="pdf-related-papers d-flex flex-row align-items-center justify-content-between mr-lg-5 mr-2 order-3">
        <button
          title="Show related papers"
          type="button"
          className="btn m-auto h-100"
          onClick={() => setRelatedPapersClicked(!relatedPapersClicked)}
        >
          {!relatedPapersClicked ? 'Related papers' : 'Back to reading'}
        </button>
      </div>
      <div className="pdf-preferences d-flex flex-row align-items-center justify-content-between mr-lg-5 mr-2">
        <button
          title="Rotate"
          type="button"
          className="btn"
          onClick={() => {
            const delta = 90
            viewer.pagesRotation = (viewer.pagesRotation + 360 + delta) % 360

            // important to rerender otherwise page becomes slightly
            // blurred until scroll event occurs
            viewer.update()
          }}
        >
          <Icon iconType="rotate" />
        </button>
        <button
          title="Zoom in"
          type="button"
          className="btn"
          disabled={viewer.currentScaleValue >= MAX_SCALE}
          onClick={() => {
            zoomIn()
            scaleChange(viewer.currentScaleValue)
            viewer.update()
          }}
        >
          <Icon iconType="zoom-in" />
        </button>
        <button
          title="Zoom out"
          type="button"
          className="btn"
          disabled={viewer.currentScaleValue <= MIN_SCALE}
          onClick={() => {
            zoomOut()
            scaleChange(viewer.currentScaleValue)
            viewer.update()
          }}
        >
          <Icon iconType="zoom-out" />
        </button>
      </div>
      <div className="pdf-pagination d-flex flex-row align-items-center justify-content-between mr-lg-5 mr-2">
        <button
          title="Previous page"
          type="button"
          className="btn"
          disabled={viewer.currentPageNumber <= 1}
          onClick={() => --viewer.currentPageNumber}
        >
          <Icon iconType="left-arrow" />
        </button>
        <div>
          <input
            type="text"
            className="form-control input-change-page-number"
            value={inputNumber}
            onBlur={() => changeInputNumber(viewer.currentPageNumber)}
            onChange={e => {
              if (e.target.value === '') changeInputNumber('')

              const pageNumber = parseInt(e.target.value, 10)
              if (
                Number.isNaN(pageNumber) ||
                pageNumber < 1 ||
                pageNumber > viewer.pagesCount
              )
                return
              viewer.currentPageNumber = pageNumber
              changeInputNumber(pageNumber)
            }}
          />{' '}
          / {viewer.pagesCount}
        </div>
        <button
          title="Next page"
          type="button"
          className="btn"
          disabled={viewer.currentPageNumber >= viewer.pagesCount}
          onClick={() => viewer.currentPageNumber++}
        >
          <Icon iconType="right-arrow" />
        </button>
      </div>
    </div>
  )
}

export default Toolbar
