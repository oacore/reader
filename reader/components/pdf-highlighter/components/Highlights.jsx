import React, { Fragment } from 'react'
import ReactDom from 'react-dom'
import withAppContext from '../../../store/withAppContext'
import Highlight from './Highlight'
import { findOrCreateLayerForHighlights, findPageLayer } from '../utils/layer'

class Highlights extends React.PureComponent {
  state = {
    portals: null,
  }

  componentDidMount() {
    const {
      context: {
        state: {
          pdfDocument: { pdfEventBus },
        },
      },
    } = this.props

    pdfEventBus.on('pagesloaded', () => {
      this.preparePortals()
    })
    pdfEventBus.on('updateviewarea', () => {
      this.preparePortals()
    })
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.context.state.annotations !==
      prevProps.context.state.annotations
    )
      this.preparePortals()
  }

  preparePortals() {
    const {
      context: {
        state: {
          pdfDocument: { pdfViewer },
          annotations,
        },
      },
      updateContextMenu,
    } = this.props

    if (!pdfViewer.pageViewsReady) return

    const annotationsByPage = new Map()
    Object.entries(annotations).forEach(([annotationId, annotationContent]) => {
      Object.entries(annotationContent.rects).forEach(([pageNumber, rects]) => {
        const pageViewport = pdfViewer
          .getPageView(Number(pageNumber) - 1)
          .viewport.clone({
            dontFlip: true,
          })

        if (pageNumber in annotationsByPage) {
          annotationsByPage[pageNumber] = [
            ...annotationsByPage[pageNumber],
            ...rects.map((rect, index) => (
              <Highlight
                key={`${annotationId}-${index +
                  annotationsByPage[pageNumber].length}`}
                rect={rect}
                color={annotationContent.color}
                viewPort={pageViewport}
                pageNumber={pageNumber}
                annotationId={annotationId}
                onUpdateContextMenu={updateContextMenu}
              />
            )),
          ]
        } else {
          annotationsByPage[pageNumber] = [
            ...rects.map((rect, index) => (
              <Highlight
                // eslint-disable-next-line react/no-array-index-key
                key={`${annotationId}-${index}`}
                rect={rect}
                color={annotationContent.color}
                viewPort={pageViewport}
                pageNumber={pageNumber}
                annotationId={annotationId}
                onUpdateContextMenu={updateContextMenu}
              />
            )),
          ]
        }
      })
    })

    const portals = Object.entries(annotationsByPage).map(
      ([pageNumber, pageHighlights]) =>
        ReactDom.createPortal(
          pageHighlights,
          findOrCreateLayerForHighlights(findPageLayer(pageNumber))
        )
    )

    this.setState({ portals })
  }

  render() {
    const { portals } = this.state
    /* eslint-disable react/no-array-index-key */
    return portals
      ? portals.map((p, index) => <Fragment key={index}>{p}</Fragment>)
      : null
    /* eslint-enable react/no-array-index-key */
  }
}

export default withAppContext(Highlights)
