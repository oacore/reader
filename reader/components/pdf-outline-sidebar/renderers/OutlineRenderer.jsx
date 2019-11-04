import React, { useState } from 'react'
import { Collapse } from 'reactstrap'

const OutlineGroup = ({ outline, linkService, isExpanded }) => {
  return (
    <Collapse isOpen={isExpanded}>
      <ol>
        {outline.map((item, index) => {
          /* eslint-disable react/no-array-index-key */
          return (
            <OutlineItem
              key={`${index}${isExpanded}`}
              item={item}
              linkService={linkService}
              isExpanded={isExpanded}
            />
          )
          /* eslint-enable */
        })}
      </ol>
    </Collapse>
  )
}

const OutlineItem = ({ isExpanded, item, linkService }) => {
  const [isOpen, toggleIsOpen] = useState(isExpanded)

  return (
    <li role="treeitem" aria-expanded={isOpen}>
      {Boolean(item.items.length) && (
        <button
          type="button"
          onClick={() => toggleIsOpen(!isOpen)}
          className="outline-button"
        >
          <span className="sr-only">{isOpen ? 'Collapse' : 'Expand'} menu</span>
        </button>
      )}
      <a
        onClick={() => {
          if (item.dest) linkService.navigateTo(item.dest)
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
