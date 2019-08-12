import { DIST_DIR, SRC_DIR } from './constants'

module.exports = {
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
