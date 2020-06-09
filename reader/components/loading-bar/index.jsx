import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

const LoadingBar = ({ className, tag: Tag = 'div' }) => (
  <Tag className={classNames.use(styles.loadingBar).join(className)} />
)

export default LoadingBar
