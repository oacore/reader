import React, { createContext, useContext, useReducer } from 'react'
import reducers, { initialState } from './reducers'

const GlobalContext = createContext({})

export const GlobalProvider = ({ children, metadata, document }) => (
  <GlobalContext.Provider
    value={useReducer(reducers, { ...initialState, metadata, document })}
  >
    {children}
  </GlobalContext.Provider>
)

export const useGlobalStore = () => useContext(GlobalContext)

export const withGlobalStore = Component => {
  return React.forwardRef((props, ref) => (
    <GlobalContext.Consumer>
      {state => (
        <Component ref={ref} {...props} store={state[0]} dispatch={state[1]} />
      )}
    </GlobalContext.Consumer>
  ))
}

export default GlobalProvider
