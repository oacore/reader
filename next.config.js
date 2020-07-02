const path = require('path')

const withWorkers = require('@zeit/next-workers')
const withTM = require('next-transpile-modules')(['pdfjs-dist/lib'])
const withSourceMaps = require('@zeit/next-source-maps')

const helpers = require('./utils/helpers')

/** Build Target
 *
 * Supports the following values:
 * - 'aws' – Amazon Web Services, production
 * - 'now' – ZEIT Now, testing
 *
 * If not set or empty, means development environment.
 */

const nextConfig = {
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
    GA_TRACKING_CODE: process.env.GA_TRACKING_CODE,
    BUILD_TARGET: process.env.BUILD_TARGET,
  },
  assetPrefix: helpers.getAssetPath('', process.env.BUILD_TARGET),
  webpack: (config) => {
    const originalEntry = config.entry
    config.entry = async () => {
      const entries = await originalEntry()
      if (entries['main.js']) entries['main.js'].unshift('./polyfills')

      return entries
    }

    const splitChunks = config.optimization && config.optimization.splitChunks
    if (splitChunks) {
      const { cacheGroups } = splitChunks
      if (cacheGroups.framework) cacheGroups.commons.name = 'framework'
      if (cacheGroups.shared) cacheGroups.shared.name = 'framework'
      if (cacheGroups.lib) cacheGroups.lib.name = 'framework'
    }
    const { rules } = config.module

    // TODO: Remove once https://github.com/zeit/next.js/issues/10584 is solved and released
    // Find the array of "style rules" in the webpack config.
    // This is the array of webpack rules that:
    // - is inside a 'oneOf' block
    // - contains a rule that matches 'file.css'
    const styleRules = (
      rules.find(
        (m) => m.oneOf && m.oneOf.find(({ test: reg }) => reg.test('file.css'))
      ) || {}
    ).oneOf
    if (!styleRules) return config
    // Find all the webpack rules that handle CSS modules
    // Look for rules that match '.module.css'
    // but aren't being used to generate
    // error messages.
    const cssModuleRules = [
      styleRules.find(
        ({ test: reg, use }) =>
          reg.test('file.module.css') && use.loader !== 'error-loader'
      ),
    ].filter((n) => n) // remove 'undefined' values
    // Add the 'localsConvention' config option to the CSS loader config
    // in each of these rules.
    cssModuleRules.forEach((cmr) => {
      // Find the item inside the 'use' list that defines css-loader
      const cssLoaderConfig = cmr.use.find(({ loader }) =>
        loader.includes('css-loader')
      )
      if (cssLoaderConfig && cssLoaderConfig.options) {
        // Patch it with the new config
        cssLoaderConfig.options.localsConvention = 'camelCase'
      }
    })

    Object.assign(config.resolve.alias, {
      '@sentry/node': config.isServer ? '@sentry/node' : '@sentry/browser',

      'react': path.join(__dirname, 'node_modules', 'react'),
      'react-dom': path.join(__dirname, 'node_modules', 'react-dom'),
    })

    config.module.rules.push({
      test: /\.js$/,
      use: ['source-map-loader'],
      enforce: 'pre',
    })

    // TODO: Remove once https://github.com/zeit/next-plugins/blob/master/packages/next-workers/index.js#L20 is released
    config.output.globalObject = 'self'
    return config
  },
}
nextConfig.workerLoaderOptions = {
  publicPath: `${nextConfig.assetPrefix}/_next/`,
  name: 'static/[hash].worker.js',
}

module.exports = withSourceMaps(withTM(withWorkers(nextConfig)))
