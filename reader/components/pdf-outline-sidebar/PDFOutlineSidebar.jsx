import React from 'react'
import { Spinner } from 'reactstrap'
import withAppContext from '../../store/withAppContext'
import OutlineGroup from './renderers/OutlineRenderer'
import './PDFOutlineSidebar.scss'

class PDFOutlineSidebar extends React.PureComponent {
  containerNode = null

  state = {
    outline: null,
    isOutlineLoading: true,
  }

  componentDidMount() {
    const {
      context: {
        state: {
          pdfDocument: { pdfDocumentProxy },
        },
      },
    } = this.props

    pdfDocumentProxy.getOutline().then(outline => {
      this.setState({
        isOutlineLoading: false,
        outline,
      })
    })
  }

  Outline = ({ outline }) => {
    const {
      context: {
        state: {
          pdfDocument: { pdfLinkService },
        },
      },
    } = this.props

    if (outline.length === 0) return <h5>PDF does not contain any outline</h5>

    return (
      <OutlineGroup
        isExpanded
        pdfLinkService={pdfLinkService}
        outline={outline}
      />
    )
  }

  render() {
    const {
      context: {
        state: { isOutlineViewVisible },
      },
    } = this.props
    const { isOutlineLoading, outline } = this.state
    const { Outline } = this

    return (
      <div
        ref={node => {
          this.containerNode = node
        }}
        className="pdf-outline-view"
        style={{ visibility: isOutlineViewVisible ? 'visible' : 'hidden' }}
      >
        {isOutlineLoading ? (
          <div className="d-flex flex-column justify-content-center">
            <Spinner color="primary" />
            <h5>Outline is loading currently</h5>
          </div>
        ) : (
          <Outline outline={outline} />
        )}
      </div>
    )
  }
}

export default withAppContext(PDFOutlineSidebar)
