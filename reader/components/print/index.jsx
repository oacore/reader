import React from 'react'
import { CSS_UNITS } from 'pdfjs-dist/lib/web/ui_utils'
import { Button, Icon, LoadingBar } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'
import ReactToPrint, { PrintContextConsumer } from 'react-to-print'

import { withGlobalStore } from '../../store'
import styles from './styles.module.css'

// The size of the canvas in pixels for printing.
const PRINT_RESOLUTION = 150
const PRINT_UNITS = PRINT_RESOLUTION / 72.0

class Print extends React.Component {
  originalPrintFunction = window.print

  // canvas used for temporary rendering of individual PDF pages
  // every page is then converted to image and canvas is cleared out
  scratchCanvas = document.createElement('canvas')

  // rendered images are appended to this container
  printContainer = React.createRef()

  pagesOverview = null

  printRejected = false

  state = {
    currentPage: 0,
    pageCount: 0,
  }

  componentDidMount() {
    // Suppress shortcut for print
    // TODO: Allow shortcut for print
    window.addEventListener('keydown', this.suppressPrintShortcut)

    // Temporary suppress global print function
    window.print = () => {
      console.warn('Global print is not allowed')
    }
  }

  componentWillUnmount() {
    // Unsubscribe from all events
    window.removeEventListener('keydown', this.suppressPrintShortcut)
    window.print = this.originalPrintFunction
  }

  suppressPrintShortcut = e => {
    // Intercept Cmd/Ctrl + P in all browsers.
    // Also intercept Cmd/Ctrl + Shift + P in Chrome and Opera
    if (
      e.keyCode === /* P= */ 80 &&
      (e.ctrlKey || e.metaKey) &&
      !e.altKey &&
      (!e.shiftKey || window.chrome || window.opera)
    ) {
      console.warn('Shortcut for printing is currently not allowed.')
      e.preventDefault()
      if (e.stopImmediatePropagation) e.stopImmediatePropagation()
      else e.stopPropagation()
    }
  }

  onBeforePrint = () => {
    const {
      store: {
        document: { viewer },
      },
    } = this.props

    this.printRejected = false

    if (!viewer.hasEqualPageSizes) {
      console.warn(
        'Not all pages have the same size. The printed result may be incorrect!'
      )
    }

    this.pagesOverview = viewer.getPagesOverview()
    return this.renderPages()
  }

  onAfterPrint = () => {
    // remove all temporary rendered pages
    while (this.printContainer.current.firstChild) {
      this.printContainer.current.removeChild(
        this.printContainer.current.firstChild
      )
    }

    this.setState({
      currentPage: 0,
      pageCount: 0,
    })
  }

  renderPages = () => {
    let currentPage = -1
    const pageCount = this.pagesOverview.length
    const renderNextPage = (resolve, reject) => {
      if (this.printRejected) {
        reject()
        return
      }

      currentPage += 1
      if (currentPage >= pageCount) {
        resolve()
        return
      }

      // recursively render every page to temporary canvas
      this.renderPage(currentPage + 1, this.pagesOverview[currentPage])
        .then(this.useRenderedPage)
        .then(() => {
          this.setState({
            currentPage: currentPage + 1,
            pageCount,
          })
          renderNextPage(resolve, reject)
        }, reject)
    }

    return new Promise(renderNextPage)
  }

  renderPage = (pageNumber, size) => {
    const {
      store: { document },
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

    return document.documentProxy
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
      .then(() => ({
        width,
        height,
      }))
  }

  // convert canvas to image
  useRenderedPage = printItem => {
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
    this.printContainer.current.appendChild(wrapper)
    return new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })
  }

  rejectPrinting = () => {
    this.printRejected = true
    this.forceUpdate()
  }

  render() {
    const { currentPage, pageCount } = this.state
    const {
      store: { document },
      className,
    } = this.props
    const isPrinting = currentPage !== pageCount

    return (
      <>
        {isPrinting && <LoadingBar fixed />}
        <div
          id="pdf-print-container"
          ref={this.printContainer}
          className={styles.printContainer}
        />
        <ReactToPrint
          content={() => this.printContainer.current}
          onBeforeGetContent={() => this.onBeforePrint()}
          onAfterPrint={() => this.onAfterPrint()}
          // TODO: consider to show some warning to user
          //       that print wasn't successful
          onPrintError={() => this.onAfterPrint()}
          removeAfterPrint
          copyStyles={false}
          pageStyle={`
            *,
            html {
                box-sizing: border-box;
            }
            *, *:before, *:after {
                box-sizing: inherit;
            }

            @page {
             margin: 0;
             size: auto;
            }

            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              display: block;
            }

            #pdf-print-container {
              display: block;
            }

            #pdf-print-container > div {
              display: flex;
              flex-direction: column;
              height: 100%;
              align-items: center;
              justify-content: center;
              page-break-after:always;
              page-break-inside: avoid;
            }

            #pdf-print-container > div > img {
              max-width:100%;
              max-height:100%;
            }
          `}
        >
          <PrintContextConsumer>
            {({ handlePrint }) => (
              <Button
                title={isPrinting ? 'Cancel print' : 'Print document'}
                className={classNames
                  .use(isPrinting && styles.printActive)
                  .join(className)}
                disabled={!document.pagesLoaded}
                onClick={() => {
                  if (isPrinting) this.rejectPrinting()
                  else handlePrint()
                }}
              >
                {isPrinting ? (
                  <Icon src="#printer-off" alt="Cancel print" />
                ) : (
                  <Icon src="#printer" alt="Print document" />
                )}
              </Button>
            )}
          </PrintContextConsumer>
        </ReactToPrint>
      </>
    )
  }
}

export default withGlobalStore(Print)
