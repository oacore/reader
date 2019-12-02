import React, { createElement } from 'react'
import ReactGA from 'react-ga'

const initGA = () => {
  ReactGA.initialize(GA_TRACKING_CODE)
}

const isProduction = process.env.NODE_ENV === 'production'

const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

const withGoogleAnalytics = Page => {
  class WithAnalytics extends React.Component {
    static componentDidMount() {
      if (isProduction && GA_TRACKING_CODE) {
        if (!window.GA_INITIALIZED) {
          initGA()
          window.GA_INITIALIZED = true
        }
        logPageView()
      }
    }

    render() {
      return createElement(Page, this.props)
    }
  }

  if (Page.getInitialProps) WithAnalytics.getInitialProps = Page.getInitialProps

  return WithAnalytics
}
export default withGoogleAnalytics
