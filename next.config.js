const path = require('path')

const withWorkers = require('@zeit/next-workers')
const withTM = require('next-transpile-modules')(['pdfjs-dist'])

const csp = require('./csp.config')
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

  // Fix for sharp package in CI
  experimental: {
    esmExternals: false,
  },

  async headers() {
    return [
      {
        source: '/:path(.*)',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
    ]
  },

  webpack: (config) => {
    const originalEntry = config.entry
    config.entry = async () => {
      const entries = await originalEntry()

      if (entries['main.js'] && !entries['main.js'].includes('./polyfills.js'))
        entries['main.js'].unshift('./polyfills.js')

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
        cssLoaderConfig.options.modules.exportLocalsConvention = 'camelCase'
      }
    })

    Object.assign(config.resolve.alias, {
      '@sentry/node': config.isServer ? '@sentry/node' : '@sentry/browser',

      'react': path.join(__dirname, 'node_modules', 'react'),
      'react-dom': path.join(__dirname, 'node_modules', 'react-dom'),
    })

    // Handle native dependencies
    if (config.externals) {
      config.externals = config.externals.filter((external) => {
        if (typeof external === 'function') return true

        // Don't externalize sharp
        return external !== 'sharp'
      })
    }

    // TODO: Remove once https://github.com/zeit/next-plugins/blob/master/packages/next-workers/index.js#L20 is released
    config.output.globalObject = 'self'
    return config
  },
}
nextConfig.workerLoaderOptions = {
  // publicPath: `${nextConfig.assetPrefix}/_next/`,
  publicPath: `/reader/_next/`,
  name: 'static/[hash].worker.js',
}

module.exports = withTM(withWorkers(nextConfig))
