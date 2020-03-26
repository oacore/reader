import React, { createElement } from 'react'
import ReactGA from 'react-ga'

const isProduction = process.env.NODE_ENV === 'production'
const trackers = (GA_TRACKING_CODE || '').split(',')

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
  } else ReactGA.initialize(trackers[0])
}

const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(
    window.location.pathname,
    trackers.length === 2 ? ['prod', 'dev'] : undefined
  )
}

export const logTiming = options => {
  ReactGA.timing(options, trackers.length === 2 ? ['prod', 'dev'] : undefined)
}

export const withGoogleAnalytics = Page => {
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
