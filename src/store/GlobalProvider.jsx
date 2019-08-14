import React from 'react'
import GlobalContext from 'store/configureContext'

class GlobalProvider extends React.Component {
  state = {
    // TODO: Find better way how to do it
    // eslint-disable-next-line react/no-unused-state
    pdfDocument: {
      pdfLinkService: null,
      pdfDocumentProxy: null,
      pdfRenderingQueue: null,
      pdfEventBus: null,
    },
    // eslint-disable-next-line react/no-unused-state
    pdfUrl: null,
    isThumbnailViewVisible: false,
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
          // eslint-disable-next-line react/no-unused-state
          setPDFUrl: pdfUrl => this.setState({ pdfUrl }),
          isSidebarOpen: this.state.isThumbnailViewVisible,
          toggleIsThumbnailViewVisible: () =>
            this.setState(state => {
              return {
                isThumbnailViewVisible: !state.isThumbnailViewVisible,
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
