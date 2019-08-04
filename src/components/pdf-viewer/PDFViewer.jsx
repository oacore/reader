import React from 'react'
import Spinner from 'reactstrap/es/Spinner'
import pdfjs from 'pdfjs-dist/webpack'
import PropTypes from 'prop-types'
import withAppContext from 'store/withAppContext'

import 'components/pdf-viewer/PDFViewer.scss'

class PDFViewer extends React.PureComponent {
  async componentDidMount() {
    /**
     * Load PDF when this component is inserted into the DOM
     */
    const { pdfUrl, context } = this.props
    const pdfDocument = await pdfjs.getDocument(pdfUrl).promise

    context.setPDFDocument(pdfDocument)
  }

  render() {
    return (
      <div className="pdf-loader">
        <Spinner />
      </div>
    )
  }
}

PDFViewer.propTypes = {
  pdfUrl: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  context: PropTypes.object.isRequired, // TODO: Type it better
}

export default withAppContext(PDFViewer)
