import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

const DocumentPlaceholder = React.memo(({ children }) => (
  <div className={styles.document}>
    {children || (
      <>
        <div
          className={classNames.use(styles.header, styles.linearAnimation)}
        />
        <div
          className={classNames.use(styles.lineShort, styles.linearAnimation)}
        />
        <div
          className={classNames.use(styles.lineShort, styles.linearAnimation)}
        />
        <div
          className={classNames.use(styles.lineShort, styles.linearAnimation)}
        />
        <div className={classNames.use(styles.spacer)} />
        <div className={classNames.use(styles.line, styles.linearAnimation)} />
        <div className={classNames.use(styles.line, styles.linearAnimation)} />
        <div className={classNames.use(styles.line, styles.linearAnimation)} />
        <div className={classNames.use(styles.line, styles.linearAnimation)} />
        <div className={classNames.use(styles.line, styles.linearAnimation)} />
        <div className={classNames.use(styles.line, styles.linearAnimation)} />
        <div className={classNames.use(styles.line, styles.linearAnimation)} />
        <div className={classNames.use(styles.line, styles.linearAnimation)} />
        <div className={classNames.use(styles.line, styles.linearAnimation)} />
        <div
          className={classNames.use(styles.pagination, styles.linearAnimation)}
        />
      </>
    )}
  </div>
))

export default DocumentPlaceholder
