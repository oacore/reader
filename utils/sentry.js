// NOTE: This require will be replaced with `@sentry/browser`
// client side thanks to the webpack config in next.config.js
const Sentry = require('@sentry/node')

let sentryOptions
if (typeof SENTRY_DSN !== 'undefined') {
  sentryOptions = {
    dsn: SENTRY_DSN,
    beforeSend(event, hint) {
      const error = hint.originalException
      if (error && error.message) {
        if (error.message.match(/XRef entry/)) event.fingerprint = ['xref']
        if (
          error.message.match(
            /Unexpected server response \(.*\) while retrieving PDF/
          )
        )
          event.fingerprint = ['pdf-network-error']
      }

      return event
    },
  }
}

if (sentryOptions) Sentry.init(sentryOptions)

module.exports = {
  Sentry,
}
