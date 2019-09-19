import React from 'react'
import { flatClassList } from './utils'

import classNames from './sidebar.css'

const Sidebar = ({ children, className, tag: Tag = 'div', ...restProps }) => (
  <Tag className={flatClassList(classNames.sidebar, className)} {...restProps}>
    {children}
  </Tag>
)

export default Sidebar
