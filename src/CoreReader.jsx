import React from 'react'
import Header from 'components/header/Header'
import PDFViewer from 'components/pdf-viewer/PDFViewer'
import GlobalProvider from 'store/GlobalProvider'

import 'components/bootstrap/bootstrap.scss'
import 'CoreReader.scss'

export default class CoreReader extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <GlobalProvider>
        <div>
          <Header />
          <div className="main-area">
            <PDFViewer pdfUrl="https://arxiv.org/pdf/1907.11915.pdf" />
          </div>
        </div>
      </GlobalProvider>
    )
  }
}
