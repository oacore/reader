import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Icon } from '@oacore/design'

import styles from './styles.module.css'

const OutlineGroup = ({ outline, linkService, isExpanded }) => (
  <ol
    className={classNames.use(
      styles.outlineGroup,
      isExpanded && styles.expanded
    )}
  >
    {outline.map(
      (item, index) => (
        /* eslint-disable react/no-array-index-key */
        <OutlineItem
          key={`${index}`}
          item={item}
          linkService={linkService}
          isExpanded={isExpanded}
        />
      )
      /* eslint-enable */
    )}
  </ol>
)

const OutlineItem = ({ isExpanded, item, linkService }) => {
  const [isOpen, toggleIsOpen] = useState(isExpanded)

  return (
    // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
    <li className={styles.outlineItem} role="treeitem" aria-expanded={isOpen}>
      {Boolean(item.items.length) && (
        <button
          type="button"
          onClick={() => toggleIsOpen(!isOpen)}
          className={styles.outlineButton}
        >
          <Icon
            src="#chevron-right"
            alt={`${isOpen ? 'Collapse' : 'Expand'} menu`}
          />
        </button>
      )}
      <a
        onClick={(e) => {
          e.preventDefault()
          if (item.onClick) item.onClick()
          else if (item.dest) linkService.navigateTo(item.dest)
          return false
        }}
        href={linkService.getDestinationHash(item.dest)}
      >
        {item.title}
      </a>
      {Boolean(item.items.length) && (
        <OutlineGroup
          linkService={linkService}
          outline={item.items}
          isExpanded={isOpen}
        />
      )}
    </li>
  )
}

export default OutlineGroup
