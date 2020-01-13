import React, { createElement } from 'react'
import ReactGA from 'react-ga'

const isProduction = process.env.NODE_ENV === 'production' || true

if (isProduction && GA_TRACKING_CODE) ReactGA.initialize(GA_TRACKING_CODE)

const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

export const logEvent = ({
  category,
  action,
  label,
  value,
  nonInteraction = true,
}) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
    nonInteraction,
  })
}
const withGoogleAnalytics = Page => {
  class WithAnalytics extends React.Component {
    // eslint-disable-next-line class-methods-use-this
    componentDidMount() {
      logPageView()
    }

    render() {
      return createElement(Page, this.props)
    }
  }

  if (Page.getInitialProps) WithAnalytics.getInitialProps = Page.getInitialProps

  return WithAnalytics
}
export default withGoogleAnalytics
