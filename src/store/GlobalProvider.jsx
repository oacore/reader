import React from 'react'
import GlobalContext from 'store/configureContext'

class GlobalProvider extends React.Component {
  state = {
    // TODO: Find better way how to do it
    // eslint-disable-next-line react/no-unused-state
    pdfDocument: null,
    // eslint-disable-next-line react/no-unused-state
    pdfUrl: null,
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          state: this.state,
          // eslint-disable-next-line react/no-unused-state
          setPDFDocument: pdfDocument => this.setState({ pdfDocument }),
          // eslint-disable-next-line react/no-unused-state
          setPDFUrl: pdfUrl => this.setState({ pdfUrl }),
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}

export default GlobalProvider
