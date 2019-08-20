import React from 'react'
import Header from 'components/header/Header'
import MainArea from 'components/main-area/MainArea'
import GlobalProvider from 'store/GlobalProvider'

import 'components/bootstrap/bootstrap.scss'

const CoreReader = ({ pdfUrl, pdfId }) => {
  return (
    <GlobalProvider>
      <div>
        <Header />
        <MainArea pdfUrl={pdfUrl} pdfId={pdfId} />
      </div>
    </GlobalProvider>
  )
}

export default CoreReader
