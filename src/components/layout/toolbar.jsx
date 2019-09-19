import React from 'react'
import { flatClassList } from './utils'

import classNames from './toolbar.css'

const Toolbar = ({
  children,
  isOpen,
  className,
  tag: Tag = 'div',
  ...restProps
}) => (
  <Tag className={flatClassList(classNames.toolbar, className)} {...restProps}>
    {children}
  </Tag>
)

export default Toolbar
