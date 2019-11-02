import React from 'react'

import logoPath from './assets/core-symbol.svg'
import './Logo.scss'

const Logo = () => (
  <span className="logo">
    <img src={logoPath} alt="CORE logo" />
    CORE
  </span>
)

export default Logo
