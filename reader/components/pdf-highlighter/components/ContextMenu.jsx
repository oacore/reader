import React from 'react'
import { Tooltip } from 'reactstrap'
import { isEmpty, noop, debounce } from 'lodash'
import withAppContext from 'store/withAppContext'
import { Markup } from 'interweave'
import Icon from '../../icons/Icon'
import getWikipediaSuggestions from '../utils/wiki-suggestions'

const HIGHLIGHTS_COLORS = ['red', 'yellow', 'green', 'blue']

class ContextMenu extends React.PureComponent {
  state = {
    isInnerVisible: true,
    isAddNewAnnotationVisible: false,
    isCopyToClipboardVisible: false,
    isSearchVisible: false,
    isWikipediaSearchVisible: false,
    isShowCopied: false,
    wikipediaSuggestions: null,
    showWikipediaSuggestions: false,
  }

  copyClipBoardInputRef = null

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevState.showWikipediaSuggestions === false &&
      this.state.showWikipediaSuggestions
    ) {
      if (this.state.wikipediaSuggestions === null)
        await this.loadWikipediaSuggestions()
    }
  }

  setAnnotationAndToggleSidebar(color) {
    const {
      state: { annotations, isEnhancementViewVisible },
      setAnnotation,
      toggleIsEnhancementViewVisible,
    } = this.props.context
    const { rects, selectedText, annotationId } = this.props
    let toggleSidebar = noop
    if (!isEnhancementViewVisible && isEmpty(annotations))
      toggleSidebar = toggleIsEnhancementViewVisible

    if (annotationId !== null) {
      setAnnotation(annotationId, {
        color,
      })
    } else {
      const annotationIndex = Object.keys(annotations).length + 1
      setAnnotation(annotationIndex, {
        color,
        rects,
        selectedText,
      })
      window.getSelection().removeAllRanges()
    }

    toggleSidebar()
  }

  loadWikipediaSuggestions = async () => {
    const wikipediaSuggestions = await getWikipediaSuggestions(
      this.props.selectedText
    )

    this.setState({
      wikipediaSuggestions,
    })
  }

  determineVisibility = () => {
    const { annotationId, isVisible } = this.props
    const { isInnerVisible } = this.state

    if (annotationId === null) return isVisible
    if (isInnerVisible) return true

    return isVisible
  }

  copyToClipBoard = () => {
    // Source: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    if (this.copyClipBoardInputRef === null) return

    // Select the text field
    this.copyClipBoardInputRef.select()

    // For mobile devices
    this.copyClipBoardInputRef.setSelectionRange(0, 99999)

    // Copy the text inside the text field
    document.execCommand('copy')

    this.setState({
      isShowCopied: true,
      isCopyToClipboardVisible: false,
    })
    setTimeout(() => this.setState({ isShowCopied: false }), 1000)
  }

  toggle = ({
    isAddNewAnnotationVisible = false,
    isCopyToClipboardVisible = false,
    isSearchVisible = false,
    isWikipediaSearchVisible = false,
  }) => {
    this.setState({
      isAddNewAnnotationVisible,
      isCopyToClipboardVisible,
      isSearchVisible,
      isWikipediaSearchVisible,
    })
  }

  render() {
    if (!this.props.context.state) return null
    const {
      state: {
        pdfDocument: { pdfViewer },
      },
    } = this.props.context
    const { left, top, height, selectedText } = this.props
    const {
      isAddNewAnnotationVisible,
      isCopyToClipboardVisible,
      isSearchVisible,
      isWikipediaSearchVisible,
      showWikipediaSuggestions,
      wikipediaSuggestions,
    } = this.state

    // TODO: Currently annotations are available only if page is not rotated
    const isMenuVisible =
      pdfViewer.pagesRotation === 0 && this.determineVisibility()

    return (
      <div
        className={`${isMenuVisible ? 'highlight-popup-animated' : ''}`}
        style={{
          paddingBottom: height,
          visibility: isMenuVisible ? 'visible' : 'hidden',
          position: 'relative',
          left,
          top: `calc(${top} + ${height})`,
          zIndex: 500,
          display: 'inline-block',
        }}
        onMouseEnter={() => {
          if (!this.state.isInnerVisible)
            this.setState({ isInnerVisible: true })
        }}
        onMouseLeave={debounce(() => {
          if (this.state.isInnerVisible)
            this.setState({ isInnerVisible: false })
        }, 100)}
      >
        <div className="highlight-popup">
          <input
            ref={ref => {
              this.copyClipBoardInputRef = ref
            }}
            type="text"
            className="d-none"
            value={`${selectedText}`}
            onChange={noop}
          />
          <>
            {showWikipediaSuggestions && wikipediaSuggestions !== null && (
              <>
                <div className="d-flex flex-column mb-1 wiki-suggestions">
                  {wikipediaSuggestions.slice(0, 3).map(w => (
                    <a
                      href={w[0]}
                      className="mb-1"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <h6 className="m-0">
                        <Markup content={w[1]} />
                      </h6>
                      <div>
                        <Markup content={`... ${w[2]}`} />
                      </div>
                    </a>
                  ))}
                </div>
                <hr className="m-1" />
              </>
            )}
          </>
          <div className="d-flex justify-content-between menu-actions mb-1">
            <button id="add-new-annotation" className="btn p-0" type="button">
              <Tooltip
                placement="top"
                isOpen={this.state.isAddNewAnnotationVisible}
                target="add-new-annotation"
                fade={false}
                toggle={() =>
                  this.toggle({
                    isAddNewAnnotationVisible: !isAddNewAnnotationVisible,
                  })
                }
              >
                Create new annotation!
              </Tooltip>
              <Icon iconType="create-new-annotation" isActive={false} />
            </button>
            <button
              id="copy-text-to-clipboard"
              className="btn p-0"
              type="button"
              onClick={this.copyToClipBoard}
            >
              <Tooltip
                placement="top"
                isOpen={this.state.isCopyToClipboardVisible}
                target="copy-text-to-clipboard"
                fade={false}
                toggle={() =>
                  this.toggle({
                    isCopyToClipboardVisible: !isCopyToClipboardVisible,
                  })
                }
              >
                Copy text to clipboard
              </Tooltip>
              <Tooltip
                placement="top"
                isOpen={this.state.isShowCopied}
                target="copy-text-to-clipboard"
                fade={false}
              >
                Copied!
              </Tooltip>
              <Icon iconType="copy" isActive={false} />
            </button>
            <button
              id="wikification"
              className="btn p-0"
              type="button"
              onClick={() =>
                this.setState(s => ({
                  showWikipediaSuggestions: !s.showWikipediaSuggestions,
                }))
              }
            >
              <Tooltip
                placement="top"
                isOpen={this.state.isWikipediaSearchVisible}
                target="wikification"
                fade={false}
                toggle={() =>
                  this.toggle({
                    isWikipediaSearchVisible: !isWikipediaSearchVisible,
                  })
                }
              >
                Search Wikipedia
              </Tooltip>
              <Icon iconType="wiki" isActive={showWikipediaSuggestions} />
            </button>
            <a
              id="search-web"
              className="btn p-0"
              href={`http://www.google.com/search?q=${encodeURIComponent(
                selectedText
              )}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Tooltip
                placement="top"
                isOpen={this.state.isSearchVisible}
                target="search-web"
                fade={false}
                toggle={() =>
                  this.toggle({
                    isSearchVisible: !isSearchVisible,
                  })
                }
              >
                Search on Google
              </Tooltip>
              <Icon iconType="search" isActive={false} />
            </a>
          </div>
          <hr className="m-1" />
          <div className="d-flex justify-content-between menu-colors">
            {HIGHLIGHTS_COLORS.map(color => (
              <button
                key={color}
                className="btn p-0"
                type="button"
                onClick={() => this.setAnnotationAndToggleSidebar(color)}
              >
                <span className={`dot dot-${color}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default withAppContext(ContextMenu)
