import React, { useEffect, useRef, useReducer } from 'react'
import { Icon, Button } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import './styles.module.css'
import { useGlobalStore } from '../../store'
import {
  changeCurrentPageNumber,
  scrollToRelatedPapers,
  unsetRelatedPapers,
} from '../../store/ui/actions'

const MIN_SCALE = 0.1
const MAX_SCALE = 10.0
const DEFAULT_SCALE_DELTA = 1.1

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'set_read_position':
      return {
        ...state,
        readPosition: payload.position,
      }

    case 'toggle_related_papers':
      return {
        ...state,
        relatedPapersClicked: !state.relatedPapersClicked,
      }

    case 'toggle_visibility':
      return {
        ...state,
        isVisible: payload.visibility,
      }

    default:
      return state
  }
}

const Toolbar = ({ viewer, eventBus }) => {
  const [{ ui }, globalDispatch] = useGlobalStore()

  const [state, dispatch] = useReducer(reducer, {
    readPosition: 0,
    relatedPapersClicked: null,
    isVisible: false,
  })
  const toolbarRef = useRef()
  const inputPageNumber = useRef()

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
        dispatch({
          type: 'change_visibility',
          payload: { visibility: false },
        })
      }, 1000)

    let timeoutId

    const onPageChange = () => {
      if (ui.isRelatedPapersScrolled && timeoutId)
        globalDispatch(unsetRelatedPapers())
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeoutVisibility()
      dispatch({
        type: 'change_visibility',
        payload: { visibility: true },
      })
    }
    eventBus.on('pagechanging', onPageChange)

    // component will unmount
    return () => eventBus.off('pagechanging', onPageChange)
  }, [])

  useEffect(() => {
    if (state.relatedPapersClicked === null) return

    if (state.relatedPapersClicked) {
      dispatch({
        type: 'set_read_position',
        payload: {
          position: toolbarRef.current.parentNode.scrollTop,
        },
      })
      globalDispatch(scrollToRelatedPapers())
    } else {
      toolbarRef.current.parentNode.scroll({
        left: 0,
        top: state.readPosition + 1000,
        behavior: 'auto',
      })

      // needs to be within timeout otherwise events
      // get merged and everything is scrolled smoothly not only last 900px
      setTimeout(
        () =>
          toolbarRef.current.parentNode.scroll({
            left: 0,
            top: state.readPosition,
            behavior: 'smooth',
          }),
        50
      )
      globalDispatch(unsetRelatedPapers())
    }
  }, [state.relatedPapersClicked])

  const handleBlurInput = () => {
    const pageNumber =
      Number.parseInt(inputPageNumber.current.value, 10) ||
      viewer.currentPageNumber

    if (pageNumber < 1 || pageNumber > viewer.pagesCount)
      globalDispatch(changeCurrentPageNumber(viewer.currentPageNumber))

    viewer.currentPageNumber = pageNumber
    globalDispatch(changeCurrentPageNumber(pageNumber))
  }

  return (
    <div
      className={classNames.use(
        'pdf-toolbar',
        state.isVisible && 'pdf-toolbar-visible'
      )}
      ref={toolbarRef}
    >
      {ui.isRecommenderLoaded && (
        <div className="pdf-related-papers">
          <Button
            title="Show related papers"
            type="button"
            onClick={() =>
              dispatch({
                type: 'toggle_related_papers',
              })
            }
          >
            {!state.relatedPapersClicked ? 'Related papers' : 'Back to reading'}
          </Button>
        </div>
      )}
      <div className="pdf-preferences">
        <Button
          title="Rotate"
          type="button"
          onClick={() => {
            const delta = 90
            viewer.pagesRotation = (viewer.pagesRotation + 360 + delta) % 360

            // important to rerender otherwise page becomes slightly
            // blurred until scroll event occurs
            viewer.update()
          }}
        >
          <Icon src="#format-rotate-90" alt="Rotate" />
        </Button>
        <Button
          title="Zoom in"
          type="button"
          disabled={viewer.currentScaleValue >= MAX_SCALE}
          onClick={() => {
            zoomIn()
            dispatch({ type: 'noop' })
            viewer.update()
          }}
        >
          <Icon src="#magnify-plus-outline" alt="Zoom in" />
        </Button>
        <Button
          title="Zoom out"
          type="button"
          disabled={viewer.currentScaleValue <= MIN_SCALE}
          onClick={() => {
            zoomOut()
            dispatch({ type: 'noop' })
            viewer.update()
          }}
        >
          <Icon src="#magnify-minus-outline" alt="Zoom out" />
        </Button>
      </div>
      <div className="pdf-pagination">
        <Button
          title="Previous page"
          type="button"
          disabled={viewer.currentPageNumber <= 1}
          onClick={() => {
            viewer.currentPageNumber -= 1
            globalDispatch(changeCurrentPageNumber(viewer.currentPageNumber))
          }}
        >
          <Icon src="#chevron-left" alt="Previous page" />
        </Button>
        <div className="page-number-navigation">
          <label className="m-0" htmlFor="page-number">
            <span className="sr-only">Page number</span>
            <input
              ref={inputPageNumber}
              type="text"
              className="input-change-page-number"
              name="page-number"
              value={ui.currentPageNumber}
              onChange={e => {
                if (e.target.value === '') return
                const pageNumber = Number(e.target.value)
                if (Number.isNaN(pageNumber) || pageNumber > viewer.pagesCount)
                  return

                globalDispatch(changeCurrentPageNumber(pageNumber))
              }}
              onFocus={e => e.target.select()}
              onBlur={handleBlurInput}
            />{' '}
            / <span className="pages-count">{viewer.pagesCount}</span>
          </label>
        </div>
        <Button
          title="Next page"
          type="button"
          disabled={viewer.currentPageNumber >= viewer.pagesCount}
          onClick={() => {
            viewer.currentPageNumber += 1
            globalDispatch(changeCurrentPageNumber(viewer.currentPageNumber))
          }}
        >
          <Icon src="#chevron-right" alt="Next page" />
        </Button>
      </div>
    </div>
  )
}

export default Toolbar
