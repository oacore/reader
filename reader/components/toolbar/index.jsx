import React, { useEffect, useRef, useReducer } from 'react'
import { Icon, Button, TextField } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import { logEvent } from '../../../utils/analytics'
import styles from './styles.module.css'
import { useGlobalStore } from '../../store'
import {
  changeCurrentPageNumber,
  scrollToRelatedPapers,
  unsetRelatedPapers,
} from '../../store/ui/actions'
import { getIconPath } from '../../utils/helpers'

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
        styles.pdfToolbar,
        state.isVisible && styles.pdfToolbarVisible
      )}
      ref={toolbarRef}
    >
      <div className={styles.pdfRelatedPapers}>
        <Button
          title="Show related papers"
          type="button"
          onClick={() => {
            dispatch({
              type: 'toggle_related_papers',
            })
            logEvent({
              category: 'toolbar',
              action: 'related papers click',
            })
          }}
        >
          {!state.relatedPapersClicked ? 'Related papers' : 'Back to reading'}
        </Button>
      </div>
      <div className={styles.pdfPreferences}>
        <Button
          title="Rotate"
          type="button"
          onClick={() => {
            const delta = 90
            viewer.pagesRotation = (viewer.pagesRotation + 360 + delta) % 360

            // important to rerender otherwise page becomes slightly
            // blurred until scroll event occurs
            viewer.update()
            logEvent({
              category: 'toolbar',
              action: 'rotate',
            })
          }}
        >
          <Icon src={getIconPath('format-rotate-90')} alt="Rotate" />
        </Button>
        <Button
          title="Zoom in"
          type="button"
          disabled={viewer.currentScaleValue >= MAX_SCALE}
          onClick={() => {
            zoomIn()
            dispatch({ type: 'noop' })
            viewer.update()
            logEvent({
              category: 'toolbar',
              action: 'zoom in',
            })
          }}
        >
          <Icon src={getIconPath('magnify-plus-outline')} alt="Zoom in" />
        </Button>
        <Button
          title="Zoom out"
          type="button"
          disabled={viewer.currentScaleValue <= MIN_SCALE}
          onClick={() => {
            zoomOut()
            dispatch({ type: 'noop' })
            viewer.update()
            logEvent({
              category: 'toolbar',
              action: 'zoom out',
            })
          }}
        >
          <Icon src={getIconPath('magnify-minus-outline')} alt="Zoom out" />
        </Button>
      </div>
      <div className={styles.pdfPagination}>
        <Button
          title="Previous page"
          type="button"
          disabled={viewer.currentPageNumber <= 1}
          onClick={() => {
            logEvent({
              category: 'toolbar',
              action: 'prev page',
            })
            viewer.currentPageNumber -= 1
            globalDispatch(changeCurrentPageNumber(viewer.currentPageNumber))
          }}
        >
          <Icon src={getIconPath('chevron-left')} alt="Previous page" />
        </Button>
        <div className={styles.pagination}>
          <TextField
            id="page-number"
            label="Page number"
            variant="pure"
            ref={inputPageNumber}
            type="text"
            className={styles.inputChangePageNumber}
            name="page-number"
            value={ui.currentPageNumber}
            onChange={(e) => {
              if (e.target.value === '') return
              const pageNumber = Number(e.target.value)
              if (Number.isNaN(pageNumber) || pageNumber > viewer.pagesCount)
                return

              globalDispatch(changeCurrentPageNumber(pageNumber))
              logEvent({
                category: 'toolbar',
                action: 'change page number',
              })
            }}
            onFocus={(e) => e.target.select()}
            onBlur={handleBlurInput}
          />{' '}
          / <span className={styles.pagesCount}>{viewer.pagesCount}</span>
        </div>
        <Button
          title="Next page"
          type="button"
          disabled={viewer.currentPageNumber >= viewer.pagesCount}
          onClick={() => {
            logEvent({
              category: 'toolbar',
              action: 'next page',
            })
            viewer.currentPageNumber += 1
            globalDispatch(changeCurrentPageNumber(viewer.currentPageNumber))
          }}
        >
          <Icon src={getIconPath('chevron-right')} alt="Next page" />
        </Button>
      </div>
    </div>
  )
}

export default Toolbar
