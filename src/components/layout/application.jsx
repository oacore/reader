import React, { useState } from 'react'
import { flatClassList } from './utils'

import Toolbar from './toolbar'
import Sidebar from './sidebar'

import classNames from './layout.css'

const Content = ({ children, tag: Tag = 'div', ...restProps }) => (
  <Tag className={classNames.content} {...restProps}>
    {children}
  </Tag>
)

const Layout = ({ children, tag: Tag = 'div' }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Tag
      className={flatClassList(classNames.application, {
        withSidebar: isSidebarOpen,
      })}
    >
      <Toolbar className={classNames.toolbar}>
        <div className={classNames.sidebar}>
          <button type="button" onClick={() => setSidebarOpen(value => !value)}>Toggle sidebar</button>
        </div>
        Toolbar rest
      </Toolbar>

      <div className={classNames.main}>
        <Content>{children}</Content>

        <Sidebar
          className={classNames.sidebar}
          onClick={() => setSidebarOpen(value => !value)}
        >
          <Toolbar className={classNames.toolbar}>Sidebar toolbar</Toolbar>
          <div className={classNames.content}>Sidebar content</div>
        </Sidebar>
      </div>
    </Tag>
  )
}

export default Layout
