import React, { createElement } from 'react'
import ReactGA from 'react-ga4'

const isProduction = process.env.NODE_ENV === 'production'
let isGAInitialized = false

if (isProduction && process.env.GA_TRACKING_CODE) {
  ReactGA.initialize(process.env.GA_TRACKING_CODE, {
    siteSpeedSampleRate: 2,
  })
  isGAInitialized = true
}

const logPageView = () => {
  if (!isGAInitialized) return

  ReactGA.send({
    hitType: 'Reader',
    page: `Reader. ${window.location.pathname}`,
    title: `Reader. ${window.location.pathname}`,
  })
}

export const logEvent = ({
  category,
  action,
  value,
  nonInteraction = true,
}) => {
  if (!isGAInitialized) return

  const valueCategory = category ?? 'Default category'
  const valueAction = action ?? 'Default action'
  ReactGA.event({
    category: `Reader. ${valueCategory}`,
    action: `Reader. ${valueAction}`,
    label: 'Reader',
    value: value ?? 99,
    nonInteraction: nonInteraction ?? true,
  })
}

export const logTiming = (options) => {
  if (!isGAInitialized) return
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(options))
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
