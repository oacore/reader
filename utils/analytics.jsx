import React, { createElement } from 'react'
import ReactGA from 'react-ga4'

const isProduction = process.env.NODE_ENV === 'production'
let isGAInitialized = false

if (isProduction && process.env.GA_TRACKING_CODE) {
  ReactGA.initialize(process.env.GA_TRACKING_CODE, {
    siteSpeedSampleRate: 100,
  })
  isGAInitialized = true
}

const logPageView = () => {
  if (!isGAInitialized) return

  ReactGA.send({
    hitType: 'reader',
    page: window.location.pathname,
    title: window.location.pathname,
  })
}

export const logEvent = ({
  category,
  action,
  value,
  nonInteraction = true,
}) => {
  if (!isGAInitialized) return

  ReactGA.event(
    {
      category,
      action,
      label: 'reader',
      value,
      nonInteraction,
    },
    ['prod', 'dev']
  )
}

export const logTiming = (options) => {
  if (!isGAInitialized) return
  ReactGA.set(options)
}

export const withGoogleAnalytics = (Page) => {
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
