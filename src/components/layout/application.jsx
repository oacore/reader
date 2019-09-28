import React, { useState } from 'react'
import { flatClassList } from './utils'

import Toolbar from './toolbar'
import Sidebar from './sidebar'

import classNames from './layout.css'

const Content = ({ children, className, tag: Tag = 'div', ...restProps }) => (
  <Tag className={flatClassList(classNames.content, className)} {...restProps}>
    {children}
  </Tag>
)

const Layout = ({ children, tag: Tag = 'div' }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const layoutClassName = flatClassList(classNames.application, {
    withSidebar: isSidebarOpen,
  })

  return (
    <Tag className={layoutClassName}>
      <Toolbar className={classNames.toolbar}>
        <div className={classNames.sidebar}>
          <button type="button" onClick={() => setSidebarOpen(value => !value)}>
            Toggle sidebar
          </button>
        </div>
        Toolbar rest
      </Toolbar>

      <Content>{children}</Content>

      <Sidebar
        className={classNames.sidebar}
        onClick={() => setSidebarOpen(value => !value)}
      >
        Sidebar content
      </Sidebar>
    </Tag>
  )
}

export default Layout
