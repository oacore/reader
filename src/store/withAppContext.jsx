import React from 'react'
import GlobalContext from 'store/configureContext'

const withAppContext = Component => {
  return props => (
    <GlobalContext.Consumer>
      {state => <Component {...props} context={state} />}
    </GlobalContext.Consumer>
  )
}

export default withAppContext
