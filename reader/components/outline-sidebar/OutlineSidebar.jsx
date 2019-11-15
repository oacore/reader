import React from 'react'
import { Spinner } from 'reactstrap'
import OutlineGroup from './renderers/OutlineRenderer'
import './OutlineSidebar.scss'
import { withGlobalStore } from '../../store'
import { scrollToRelatedPapers } from '../../store/ui/actions'

class OutlineSidebar extends React.PureComponent {
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
      dispatch,
    } = this.props

    const finalOutline = [
      ...(outline || []),
      {
        onClick: () => {
          dispatch(scrollToRelatedPapers())
        },
        title: 'Related papers',
        items: [],
      },
    ]

    return (
      <>
        {!outline && (
          <div className="missing-outline">
            Document outline is not available for this moment. We are working
            hard to bring this feature to bring this feature to majority of
            works as soon as possible.
          </div>
        )}
        <OutlineGroup
          isExpanded
          linkService={linkService}
          outline={finalOutline}
        />
      </>
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
        className="outline-view"
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

export default withGlobalStore(OutlineSidebar)
