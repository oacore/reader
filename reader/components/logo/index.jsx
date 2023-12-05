import Icon from '@oacore/design/lib/elements/icon'
import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import styles from './styles.module.css'

const DataProviderLogo = ({
  alt,
  imageSrc,
  size = 'md',
  useDefault = true,
}) => (
  <div
    className={classNames.use(styles.circle, styles[size], {
      [styles.hidden]: !useDefault,
    })}
  >
    {imageSrc ? (
      <img src={imageSrc} alt={alt} className={styles.image} />
    ) : (
      <Icon src="#office-building" className={styles.image} />
    )}
  </div>
)

export default DataProviderLogo
