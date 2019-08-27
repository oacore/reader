import React from 'react'
import withAppContext from 'store/withAppContext'

class PDFPrint extends React.Component {
  originalPrintFunction = window.print

  componentDidMount() {
    // Suppress shortcut for print
    // TODO: Allow shortcut for print
    window.addEventListener('keydown', this._suppressPrintShortcut)

    // Temporary suppress global print function
    window.print = () => {
      // eslint-disable-next-line no-console
      console.warn('Global print is not allowed')
    }
  }

  componentWillUnmount() {
    // Unsubscribe from all events
    window.removeEventListener('keydown', this._suppressPrintShortcut)
    window.print = this.originalPrintFunction
  }

  _suppressPrintShortcut = e => {
    // Intercept Cmd/Ctrl + P in all browsers.
    // Also intercept Cmd/Ctrl + Shift + P in Chrome and Opera
    if (
      e.keyCode === /* P= */ 80 &&
      (e.ctrlKey || e.metaKey) &&
      !e.altKey &&
      (!e.shiftKey || window.chrome || window.opera)
    ) {
      // eslint-disable-next-line no-console
      console.warn('Shortcut for printing is currently not allowed.')
      e.preventDefault()
      if (e.stopImmediatePropagation) e.stopImmediatePropagation()
      else e.stopPropagation()
    }
  }

  render() {
    return (
      <div
        id="pdf-print-container"
        ref={r => {
          this.printContainer = r
        }}
      />
    )
  }
}

export default withAppContext(PDFPrint)
