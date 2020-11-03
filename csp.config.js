/*!
 * Content-Security-Policy
 */
const SELF = "'self'"
const PRODUCTION = '*.core.ac.uk core.ac.uk'

const config = {
  'default-src': [SELF, PRODUCTION],
  // PDF.js worker sadly uses unsafe-eval
  'script-src': [SELF, '*.google-analytics.com', "'unsafe-eval'"],
  'style-src': [
    SELF,
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    // TODO: Move 'unsafe-inline' to dev when the Next.js' bug is resolved
    // See more: https://github.com/vercel/next.js/issues/17445
    "'unsafe-inline'",
  ],
  'font-src': [SELF, 'fonts.googleapis.com', 'fonts.gstatic.com'],
  'img-src': [
    SELF,
    PRODUCTION,
    'data:',
    'blob:',
    // Google Analytics may transport data via image:
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#transport
    '*.google-analytics.com',
    'stats.g.doubleclick.net',
  ],
  'connect-src': ['*'],
}

if (process.env.NODE_ENV !== 'production') {
  // Allow hot module replacement using inlined scripts and styles
  config['script-src'].push("'unsafe-inline'")

  // Allow connection to the local hosts in development:
  // - local API is running on a different port
  // - `localhost` and `127.0.0.1` are not the same domain technically
  config['connect-src'].push('localhost:* 127.0.0.1:*')
}

const policy = Object.entries(config)
  .map(([directive, value]) => `${directive} ${value.join(' ')}`)
  .join(';')

module.exports = policy
