import React from 'react'
import PropTypes from 'prop-types'
import withAppContext from 'store/withAppContext'
import {
  PDFPageView as _PDFPageView,
  DefaultTextLayerFactory,
} from 'pdfjs-dist/web/pdf_viewer'

import 'pdfjs-dist/web/pdf_viewer.css'
import 'components/pdf-viewer/PDFViewer.scss'

class PDFViewer extends React.PureComponent {
  containerNode = null

  componentDidMount() {
    /**
     * Load PDF when this component is inserted into the DOM
     */
    const {
      context: {
        state: { pdfDocument },
      },
    } = this.props

    // iterates over every page in PDF file and draw it
    const pagesCount = pdfDocument.numPages
    for (let pageNum = 1; pageNum <= pagesCount; pageNum++) {
      pdfDocument.getPage(pageNum).then(currentPage => {
        const pdfPageView = new _PDFPageView({
          container: this.containerNode,
          id: pageNum,
          scale: 1.0, // Fit the whole container
          defaultViewport: currentPage.getViewport({ scale: 1.0 }),
        })

        // Associate the actual page with the view and draw it.
        pdfPageView.setPdfPage(currentPage)
        pdfPageView.draw()
      })
    }
  }

  render() {
    return (
      <div className="pdf-highlighter">
        <div
          ref={node => {
            this.containerNode = node
          }}
          className="pdf-viewer"
        />
      </div>
    )
  }
}

PDFViewer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  context: PropTypes.object.isRequired, // TODO: Type it better
}

export default withAppContext(PDFViewer)
