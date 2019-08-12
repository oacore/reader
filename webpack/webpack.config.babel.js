import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'

const ABSOLUTE_BASE = path.normalize(path.join(__dirname, '..'))
const BUILD_DIR = path.join(ABSOLUTE_BASE, 'build')
const DIST_DIR = path.join(ABSOLUTE_BASE, 'dist')
const SRC_DIR = path.join(ABSOLUTE_BASE, 'src')

const WEBPACK_CONFIG = {
  entry: `${SRC_DIR}/index.js`,
  output: {
    path: DIST_DIR,
    filename: 'index.js',
    library: 'CORE Reader',
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
}

const WEBPACK_DEV_CONFIG = {
  devtool: 'source-map',
  devServer: {
    contentBase: BUILD_DIR,
    compress: true,
    port: 9000,
  },
  plugins: [new HtmlWebpackPlugin()],
}

export default (env, argv) => {
  const IS_DEV = argv.mode !== 'production'
  return IS_DEV ? { ...WEBPACK_CONFIG, ...WEBPACK_DEV_CONFIG } : WEBPACK_CONFIG
}
