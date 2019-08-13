import React, { useContext } from 'react'
import { Navbar } from 'reactstrap'
import Icon from 'components/icons/Icon'
import GlobalContext from 'store/configureContext'

import 'components/header/Header.scss'

export const Header = () => {
  // eslint-disable-next-line no-unused-vars
  const context = useContext(GlobalContext)

  return (
    <Navbar light color="light" className="header" tag="header">
      <div className="item d-flex justify-content-start">
        <button type="button" className="btn p-0 mr-3">
          <Icon iconType="outline" />
        </button>
        <button type="button" className="btn p-0 mr-3">
          <Icon iconType="thumbnails" />
        </button>
        <button type="button" className="btn p-0">
          <Icon iconType="paper_info" />
        </button>
      </div>
      <div className="item d-flex justify-content-center">
        <button type="button" className="btn p-0">
          <Icon iconType="info" />
        </button>
      </div>
      <div className="item d-flex justify-content-end">
        <button type="button" className="btn p-0">
          <Icon iconType="share" />
        </button>
        <button type="button" className="btn p-0 ml-3">
          <Icon iconType="download" />
        </button>
        <button type="button" className="btn p-0 ml-3">
          <Icon iconType="print" />
        </button>
      </div>
    </Navbar>
  )
}

export default Header
