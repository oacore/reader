import React from 'react'
import GlobalContext from './configureContext'

class GlobalProvider extends React.Component {
  state = {
    pdfDocument: {
      pdfLinkService: this.props.pdfLinkService,
      pdfDocumentProxy: null,
      pdfRenderingQueue: this.props.pdfRenderingQueue,
      pdfEventBus: this.props.pdfEventBus,
      pdfViewer: null,
      pdfPagesLoaded: false,
    },
    pdfMetadata: {
      url: this.props.url,
      id: this.props.id,
      repositories: this.props.repositories,
      year: this.props.year,
      oai: this.props.oai,
      subjects: this.props.subjects,
      description: this.props.description,
      title: this.props.title,
    },
    annotations: {},
    isThumbnailViewVisible: false,
    isOutlineViewVisible: false,
    isEnhancementViewVisible: false,
    // eslint-disable-next-line react/no-unused-state
    printContainerRef: this.props.printContainerRef,
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
          setAnnotation: (annotationId, annotationContent) =>
            this.setState(state => {
              return {
                annotations: {
                  ...state.annotations,
                  [annotationId]: {
                    ...state.annotations[annotationId],
                    ...annotationContent,
                  },
                },
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
