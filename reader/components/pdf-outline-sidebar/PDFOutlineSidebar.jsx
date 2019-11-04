import React from 'react'
import { Spinner } from 'reactstrap'
import OutlineGroup from './renderers/OutlineRenderer'
import './PDFOutlineSidebar.scss'
import { withGlobalStore } from '../../store'

class PDFOutlineSidebar extends React.PureComponent {
  containerNode = null

  state = {
    outline: null,
    isOutlineLoading: true,
  }

  componentDidMount() {
    const {
      store: { document },
    } = this.props

    document.documentProxy.getOutline().then(outline => {
      this.setState({
        isOutlineLoading: false,
        outline,
      })
    })
  }

  Outline = ({ outline }) => {
    const {
      store: {
        document: { linkService },
      },
    } = this.props

    if (!outline || outline.length === 0)
      return <h5>PDF does not contain any outline</h5>

    return (
      <OutlineGroup isExpanded linkService={linkService} outline={outline} />
    )
  }

  render() {
    const {
      store: { ui },
    } = this.props
    const { isOutlineLoading, outline } = this.state
    const { Outline } = this

    return (
      <div
        ref={node => {
          this.containerNode = node
        }}
        className="pdf-outline-view"
        style={{
          visibility: ui.isOutlineSidebarVisible ? 'visible' : 'hidden',
        }}
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

export default withGlobalStore(PDFOutlineSidebar)
