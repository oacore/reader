import React, { useState } from 'react'
import { Collapse } from 'reactstrap'

const OutlineGroup = ({ outline, pdfLinkService, isExpanded }) => {
  return (
    <Collapse isOpen={isExpanded}>
      <ol>
        {outline.map((item, index) => {
          /* eslint-disable react/no-array-index-key */
          return (
            <OutlineItem
              key={`${index}${isExpanded}`}
              item={item}
              pdfLinkService={pdfLinkService}
              isExpanded={isExpanded}
            />
          )
          /* eslint-enable */
        })}
      </ol>
    </Collapse>
  )
}

const OutlineItem = ({ isExpanded, item, pdfLinkService }) => {
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
          if (item.dest) pdfLinkService.navigateTo(item.dest)
          return false
        }}
        href={pdfLinkService.getDestinationHash(item.dest)}
      >
        {item.title}
      </a>
      {Boolean(item.items.length) && (
        <OutlineGroup
          pdfLinkService={pdfLinkService}
          outline={item.items}
          isExpanded={isOpen}
        />
      )}
    </li>
  )
}

export default OutlineGroup
