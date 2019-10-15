import withCss from '@zeit/next-css'
import withSass from '@zeit/next-sass'
import withImages from 'next-images'
import withWorkers from '@zeit/next-workers'
import withTM from 'next-transpile-modules'
import webpack from 'webpack'
import dotenv from 'dotenv'

dotenv.config()

const missingEnvVars = [
  [
    'CORE_API_KEY',
    'You can generate free API key here at https://core.ac.uk/api-keys/register/',
  ],
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

const isExpress = process.env.EXPRESS_SERVER
const nextConfig = {
  assetPrefix: isExpress ? '/reader-beta' : '',
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
