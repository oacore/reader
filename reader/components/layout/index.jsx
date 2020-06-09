import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

const Layout = ({
  children,
  className = '',
  tag: Tag = 'div',
  ...restProps
}) => (
  <Tag
    className={classNames.use(styles.appContainer).join(className)}
    {...restProps}
  >
    {children}
  </Tag>
)

export default Layout
