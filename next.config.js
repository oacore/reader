const withCss = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withImages = require('next-images')
const withWorkers = require('@zeit/next-workers')
const withTM = require('next-transpile-modules')
const webpack = require('webpack')
const dotenv = require('dotenv')
const withSourceMaps = require('@zeit/next-source-maps')

const helpers = require('./utils/helpers')

dotenv.config()

const missingEnvVars = [
  [
    'CORE_RECOMMENDER_API_KEY',
    'You can generate free API key here at https://core.ac.uk/recommender/register/',
  ],
].filter(
  ([name]) => process.env[name] === undefined || process.env[name] === ''
)

if (missingEnvVars.length > 0) {
  const varList = missingEnvVars
    .map(([name, description]) => `- ${name}\n    ${description}`)
    .join('\n')
  console.error(
    `Following environment variables are missing:\n${varList}\n Please export it or use .env file and try again.`
  )
  process.exit(1)
}

/** Build Target
 *
 * Supports the following values:
 * - 'aws' – Amazon Web Services, production
 * - 'now' – ZEIT Now, testing
 *
 * If not set or empty, means development environment.
 */

const nextConfig = {
  assetPrefix: helpers.getAssetPath('', process.env.BUILD_TARGET),
  webpack: config => {
    const originalEntry = config.entry
    config.entry = async () => {
      const entries = await originalEntry()
      if (entries['main.js']) entries['main.js'].unshift('./polyfills')

      return entries
    }

    if (!config.isServer)
      config.resolve.alias['@sentry/node'] = '@sentry/browser'

    config.module.rules.push({
      test: /\.js$/,
      use: ['source-map-loader'],
      enforce: 'pre',
    })

    config.plugins.push(
      new webpack.DefinePlugin({
        CORE_RECOMMENDER_API_KEY: JSON.stringify(
          process.env.CORE_RECOMMENDER_API_KEY
        ),
        GA_TRACKING_CODE: JSON.stringify(process.env.GA_TRACKING_CODE),
        BUILD_TARGET: JSON.stringify(process.env.BUILD_TARGET),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
      })
    )

    // TODO: Remove once https://github.com/zeit/next-plugins/blob/master/packages/next-workers/index.js#L20 is released
    config.output.globalObject = 'self'
    return config
  },
  transpileModules: ['pdfjs-dist/external', 'pdfjs-dist/lib'],
}

nextConfig.workerLoaderOptions = {
  publicPath: `${nextConfig.assetPrefix}/_next/`,
  name: 'static/[hash].worker.js',
}

module.exports = withSourceMaps(
  withTM(withWorkers(withImages(withSass(withCss(nextConfig)))))
)
