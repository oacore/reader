import React from 'react'
import Header from 'components/header/Header'
import PDFViewer from 'components/pdf-viewer/PDFViewer'

import 'components/bootstrap/bootstrap.scss'

export default class CoreReader extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <Header />
        <PDFViewer />
      </div>
    )
  }
}
