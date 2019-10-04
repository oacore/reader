const withCss = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withImages = require('next-images')
const withWorkers = require('@zeit/next-workers')
const withTM = require('next-transpile-modules')

const nextConfig = {
  webpack: config => {
    // TODO: Remove once https://github.com/zeit/next-plugins/blob/master/packages/next-workers/index.js#L20 is released
    config.output.globalObject = 'self'
    return config
  },
  transpileModules: ['pdfjs-dist/external', 'pdfjs-dist/lib'],
}

module.exports = withTM(withWorkers(withImages(withSass(withCss(nextConfig)))))
