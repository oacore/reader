import React from 'react'

import OutlineGroup from './outline-renderer'
import styles from './styles.module.css'
import { withGlobalStore } from '../../store'
import { scrollToRelatedPapers } from '../../store/ui/actions'

class OutlineSidebar extends React.PureComponent {
  relatedPapersInOutline = false

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
        ui: { isRecommenderLoaded },
      },
      dispatch,
    } = this.props

    const finalOutline = outline || []

    if (isRecommenderLoaded && !this.relatedPapersInOutline) {
      finalOutline.push({
        onClick: () => {
          dispatch(scrollToRelatedPapers())
        },
        title: 'Related papers',
        items: [],
      })
      this.relatedPapersInOutline = true
    }

    return (
      <>
        {(!outline || outline.length === 0) && (
          <div className={styles.missingOutline}>
            Document outline is not available for this moment.
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
        className={styles.outlineView}
        style={{
          visibility: ui.isOutlineSidebarVisible ? 'visible' : 'hidden',
        }}
      >
        {isOutlineLoading ? (
          <div className={styles.outlineLoading}>
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
