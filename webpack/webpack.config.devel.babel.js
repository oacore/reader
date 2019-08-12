import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BUILD_DIR, SRC_DIR } from './constants'

module.exports = {
  devtool: 'source-map',
  entry: `${SRC_DIR}/index.js`,
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
  devServer: {
    contentBase: BUILD_DIR,
    compress: true,
    port: 9000,
  },
  plugins: [new HtmlWebpackPlugin()],
}
