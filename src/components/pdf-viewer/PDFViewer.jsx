import React from 'react'
import Spinner from 'reactstrap/es/Spinner'

import 'components/pdf-viewer/PDFViewer.scss'

class PDFViewer extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div className="pdf-loader">
        <Spinner />
      </div>
    )
  }
}

export default PDFViewer
