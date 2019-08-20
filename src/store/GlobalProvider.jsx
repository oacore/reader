import React from 'react'
import GlobalContext from 'store/configureContext'

class GlobalProvider extends React.Component {
  state = {
    pdfDocument: {
      pdfLinkService: null,
      pdfDocumentProxy: null,
      pdfRenderingQueue: null,
      pdfEventBus: null,
    },
    pdfMetadata: {
      url: null,
      id: null,
    },
    isThumbnailViewVisible: false,
    isOutlineViewVisible: false,
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          state: this.state,
          // eslint-disable-next-line react/no-unused-state
          setPDFDocument: pdfDocument =>
            this.setState(state => {
              return {
                pdfDocument: { ...state.pdfDocument, ...pdfDocument },
              }
            }),
          setPDFMetadata: metadata =>
            this.setState(state => {
              return {
                pdfMetadata: { ...state.pdfMetadata, ...metadata },
              }
            }),
          isSidebarOpen:
            this.state.isThumbnailViewVisible ||
            this.state.isOutlineViewVisible,
          toggleIsThumbnailViewVisible: () =>
            this.setState(state => {
              return {
                isThumbnailViewVisible: !state.isThumbnailViewVisible,
                isOutlineViewVisible: false,
              }
            }),
          toggleIsOutlineViewVisible: () =>
            this.setState(state => {
              return {
                isOutlineViewVisible: !state.isOutlineViewVisible,
                isThumbnailViewVisible: false,
              }
            }),
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}

export default GlobalProvider
