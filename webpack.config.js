var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './index',
  output: {
    path: 'build',
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin()]
}
