import React from 'react'
import GlobalContext from './configureContext'

const withAppContext = Component => {
  return React.forwardRef((props, ref) => (
    <GlobalContext.Consumer>
      {state => <Component ref={ref} {...props} context={state} />}
    </GlobalContext.Consumer>
  ))
}

export default withAppContext
