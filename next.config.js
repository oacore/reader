import withCss from '@zeit/next-css'
import withSass from '@zeit/next-sass'
import withImages from 'next-images'
import withWorkers from '@zeit/next-workers'
import withTM from 'next-transpile-modules'
import webpack from 'webpack'
import dotenv from 'dotenv'

dotenv.config()

if (process.env.CORE_API_KEY === undefined) {
  console.error(
    'CORE API key was not provided. Please generate free API key here: https://core.ac.uk/api-keys/register/ and put it in `.env` file.'
  )
  process.exit(1)
}

if (process.env.CORE_RECOMMENDER_API_KEY === undefined) {
  console.error(
    'CORE Recommender API key was not provided. Please generate free API key here: https://core.ac.uk/recommender/register/ and put it in `.env` file.'
  )
  process.exit(1)
}

const nextConfig = {
  webpack: config => {
    const originalEntry = config.entry
    config.entry = async () => {
      const entries = await originalEntry()
      if (entries['main.js']) entries['main.js'].unshift('./polyfills')

      return entries
    }

    config.plugins.push(
      new webpack.DefinePlugin({
        CORE_API_KEY: JSON.stringify(process.env.CORE_API_KEY),
        CORE_RECOMMENDER_API_KEY: JSON.stringify(
          process.env.CORE_RECOMMENDER_API_KEY
        ),
      })
    )

    // TODO: Remove once https://github.com/zeit/next-plugins/blob/master/packages/next-workers/index.js#L20 is released
    config.output.globalObject = 'self'
    return config
  },
  transpileModules: ['pdfjs-dist/external', 'pdfjs-dist/lib'],
}

module.exports = withTM(withWorkers(withImages(withSass(withCss(nextConfig)))))
