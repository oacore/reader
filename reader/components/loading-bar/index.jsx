import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import './styles.module.css'

const LoadingBar = ({ className, tag: Tag = 'div' }) => (
  <Tag className={classNames.use('loading-bar').join(className)} />
)

export default LoadingBar
