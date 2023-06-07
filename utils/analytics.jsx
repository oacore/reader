import React, { createElement } from 'react'
import ReactGA from 'react-ga4'

const isProduction = process.env.NODE_ENV === 'production'
const trackers = (process.env.GA_TRACKING_CODE || '').split(',')
let isGAInitialized = false

if (isProduction && trackers[0] !== '') {
  if (trackers.length === 2) {
    ReactGA.initialize([
      {
        trackingId: trackers[0],
        gaOptions: {
          name: 'prod',
          siteSpeedSampleRate: 10,
        },
      },
      {
        trackingId: trackers[1],
        gaOptions: {
          name: 'dev',
          siteSpeedSampleRate: 10,
        },
      },
    ])
    isGAInitialized = true
  } else {
    ReactGA.initialize(trackers[0])
    isGAInitialized = true
  }
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
    trackers.length === 2 ? ['prod', 'dev'] : undefined
  )
}

export const logTiming = (options) => {
  if (!isGAInitialized) return
  ReactGA.timing(options, trackers.length === 2 ? ['prod', 'dev'] : undefined)
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
