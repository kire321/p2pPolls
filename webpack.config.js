var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './index.jsx',
  module: {
      loaders: [
          {
              test: /\.css$/,
              loader: "style-loader!css-loader"
          },
          {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel'
          },
          { test: /\.woff$/,   loader: "url-loader?limit=10000&mimetype=application/font-woff" },
          { test: /\.woff2$/,   loader: "url-loader?limit=10000&mimetype=application/font-woff" },
          { test: /\.ttf$/,    loader: "file-loader" },
          { test: /\.eot$/,    loader: "file-loader" },
          { test: /\.svg$/,    loader: "file-loader" },
      ],
  },
  output: {
    path: 'build',
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin()]
}
