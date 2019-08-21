import React from 'react'
import GlobalContext from 'store/configureContext'

class GlobalProvider extends React.Component {
  state = {
    pdfDocument: {
      pdfLinkService: null,
      pdfDocumentProxy: null,
      pdfRenderingQueue: null,
      pdfEventBus: null,
      pdfViewer: null,
    },
    pdfMetadata: {
      url: null,
      id: null,
      publisher: null,
      year: null,
      additionalInfo: null,
    },
    isThumbnailViewVisible: false,
    isOutlineViewVisible: false,
    isEnhancementViewVisible: false,
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          state: this.state,
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
            this.state.isOutlineViewVisible ||
            this.state.isEnhancementViewVisible,
          toggleIsThumbnailViewVisible: () =>
            this.setState(state => {
              return {
                isThumbnailViewVisible: !state.isThumbnailViewVisible,
                isEnhancementViewVisible: false,
                isOutlineViewVisible: false,
              }
            }),
          toggleIsEnhancementViewVisible: () =>
            this.setState(state => {
              return {
                isEnhancementViewVisible: !state.isEnhancementViewVisible,
                isThumbnailViewVisible: false,
                isOutlineViewVisible: false,
              }
            }),
          toggleIsOutlineViewVisible: () =>
            this.setState(state => {
              return {
                isOutlineViewVisible: !state.isOutlineViewVisible,
                isThumbnailViewVisible: false,
                isEnhancementViewVisible: false,
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
