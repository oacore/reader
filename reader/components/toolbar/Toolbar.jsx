import React, { useEffect, useRef, useReducer } from 'react'
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

    case 'change_input_number':
      return {
        ...state,
        inputNumber: payload.inputNumber,
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
    inputNumber: viewer.currentPageNumber,
  })
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
      Number.parseInt(state.inputNumber, 10) || viewer.currentPageNumber

    if (pageNumber < 1 || pageNumber > viewer.pagesCount) {
      dispatch({
        type: 'change_input_number',
        payload: {
          inputNumber: viewer.currentPageNumber,
        },
      })
    }

    viewer.currentPageNumber = pageNumber
    dispatch({
      type: 'change_input_number',
      payload: {
        inputNumber: pageNumber,
      },
    })
  }

  return (
    <div
      className={`pdf-toolbar d-flex flex-wrap justify-content-end align-items-center ${
        state.isVisible ? 'pdf-toolbar-visible' : 'pdf-toolbar-visible'
      }`}
      ref={toolbarRef}
    >
      <div className="pdf-related-papers d-flex flex-row align-items-center justify-content-between mr-lg-5 mr-2 order-3">
        <button
          title="Show related papers"
          type="button"
          className="btn m-auto h-100"
          onClick={() =>
            dispatch({
              type: 'toggle_related_papers',
            })
          }
        >
          {!state.relatedPapersClicked ? 'Related papers' : 'Back to reading'}
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
            dispatch({ type: 'noop' })
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
            dispatch({ type: 'noop' })
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
          onClick={() =>
            dispatch({
              type: 'change_input_number',
              payload: {
                inputNumber: --viewer.currentPageNumber,
              },
            })
          }
        >
          <Icon iconType="left-arrow" />
        </button>
        <div className="page-number-navigation">
          <label className="m-0" htmlFor="page-number">
            <span className="sr-only">Page number</span>
            <input
              type="text"
              className="form-control input-change-page-number"
              name="page-number"
              value={state.inputNumber}
              onChange={e => {
                const pageNumber = Number(e.target.value)
                if (Number.isNaN(pageNumber) || pageNumber > viewer.pagesCount)
                  return

                dispatch({
                  type: 'change_input_number',
                  payload: {
                    inputNumber: e.target.value,
                  },
                })
              }}
              onFocus={e => e.target.select()}
              onBlur={handleBlurInput}
            />{' '}
            / <span className="pages-count">{viewer.pagesCount}</span>
          </label>
        </div>
        <button
          title="Next page"
          type="button"
          className="btn"
          disabled={viewer.currentPageNumber >= viewer.pagesCount}
          onClick={() =>
            dispatch({
              type: 'change_input_number',
              payload: {
                inputNumber: ++viewer.currentPageNumber,
              },
            })
          }
        >
          <Icon iconType="right-arrow" />
        </button>
      </div>
    </div>
  )
}

export default Toolbar
