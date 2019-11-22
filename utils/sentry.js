// NOTE: This require will be replaced with `@sentry/browser`
// client side thanks to the webpack config in next.config.js
const Sentry = require('@sentry/node')

let sentryOptions
if (typeof SENTRY_DSN !== 'undefined') {
  sentryOptions = {
    dsn: SENTRY_DSN,
  }
}

if (sentryOptions) Sentry.init(sentryOptions)

module.exports = {
  Sentry,
}
