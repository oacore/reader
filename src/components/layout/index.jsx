import React from 'react'

import './layout.scss'

const Layout = ({
  children,
  className = '',
  tag: Tag = 'div',
  ...restProps
}) => (
  <Tag className={`app-container ${className}`} {...restProps}>
    {children}
  </Tag>
)

export default Layout
