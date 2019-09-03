import React from 'react'
import { CSS_UNITS } from 'pdfjs-dist/lib/web/ui_utils'
import withAppContext from 'store/withAppContext'
import {
  Progress,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'

import './PDFPrint.scss'

// The size of the canvas in pixels for printing.
const PRINT_RESOLUTION = 150
const PRINT_UNITS = PRINT_RESOLUTION / 72.0

class PDFPrint extends React.Component {
  originalPrintFunction = window.print

  // canvas used for temporary rendering of individual PDF pages
  // every page is then converted to image and canvas is cleared out
  scratchCanvas = document.createElement('canvas')

  // rendered images are appended to this container
  printContainer = null

  pagesOverview = null

  state = {
    isPrintModalOpen: false,
    printProgress: 0,
  }

  printRejected = false

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

  onBeforePrint = () => {
    const {
      context: {
        state: {
          pdfDocument: { pdfViewer },
        },
      },
    } = this.props

    this.printRejected = false
    this.setState({
      isPrintModalOpen: true,
    })

    if (!pdfViewer.hasEqualPageSizes) {
      // TODO: Consider to show some warning to user
      // eslint-disable-next-line no-console
      console.warn(
        'Not all pages have the same size. The printed result may be incorrect!'
      )
    }

    this.pagesOverview = pdfViewer.getPagesOverview()
    return this._renderPages()
  }

  onAfterPrint = () => {
    // remove all temporary rendered pages
    while (this.printContainer.firstChild)
      this.printContainer.removeChild(this.printContainer.firstChild)
    this.setState({
      isPrintModalOpen: false,
      printProgress: 0,
    })
  }

  _renderPages = () => {
    let currentPage = -1
    const pageCount = this.pagesOverview.length
    const renderNextPage = (resolve, reject) => {
      if (this.printRejected) {
        reject()
        return
      }

      if (++currentPage >= pageCount) {
        resolve()
        return
      }
      // recursively render every page to temporary canvas
      this._renderPage(currentPage + 1, this.pagesOverview[currentPage])
        .then(this._useRenderedPage)
        .then(() => {
          this.setState({
            printProgress: Math.round((100 * currentPage) / pageCount),
          })
          renderNextPage(resolve, reject)
        }, reject)
    }

    return new Promise(renderNextPage)
  }

  _renderPage = (pageNumber, size) => {
    const {
      context: {
        state: {
          pdfDocument: { pdfDocumentProxy },
        },
      },
    } = this.props

    this.scratchCanvas.width = Math.floor(size.width * PRINT_UNITS)
    this.scratchCanvas.height = Math.floor(size.height * PRINT_UNITS)

    // The physical size of the img as specified by the PDF document.
    const width = `${Math.floor(size.width * CSS_UNITS)}px`
    const height = `${Math.floor(size.height * CSS_UNITS)}px`

    const ctx = this.scratchCanvas.getContext('2d')
    ctx.save()
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.fillRect(0, 0, this.scratchCanvas.width, this.scratchCanvas.height)
    ctx.restore()

    return pdfDocumentProxy
      .getPage(pageNumber)
      .then(pdfPage => {
        const renderContext = {
          canvasContext: ctx,
          transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
          viewport: pdfPage.getViewport({ scale: 1, rotation: size.rotation }),
          intent: 'print',
        }
        return pdfPage.render(renderContext).promise
      })
      .then(() => {
        return {
          width,
          height,
        }
      })
  }

  // convert canvas to image
  _useRenderedPage = printItem => {
    const wrapper = document.createElement('div')
    const img = document.createElement('img')

    img.style.width = printItem.width
    img.style.height = printItem.height

    if ('toBlob' in this.scratchCanvas) {
      this.scratchCanvas.toBlob(blob => {
        img.src = URL.createObjectURL(blob)
      })
    } else img.src = this.scratchCanvas.toDataURL()

    wrapper.appendChild(img)
    this.printContainer.appendChild(wrapper)

    return new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })
  }

  rejectPrinting = () => {
    // eslint-disable-next-line no-unused-expressions
    this.printRejected = true
    this.setState({ isPrintModalOpen: false })
  }

  render() {
    const { isPrintModalOpen, printProgress } = this.state
    return (
      <>
        <div
          id="pdf-print-container"
          ref={r => {
            this.printContainer = r
          }}
        />
        <div>
          <Modal isOpen={isPrintModalOpen} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Print in progress</ModalHeader>
            <ModalBody>
              <Progress value={printProgress} />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.rejectPrinting}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </>
    )
  }
}

export default withAppContext(PDFPrint)
