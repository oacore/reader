import React from 'react'

import './Layout.scss'

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
