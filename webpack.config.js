var rucksack = require('rucksack-css')
var webpack = require('webpack')
var path = require('path')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var isDev = process.env.NODE_ENV === 'development'

var config = {
  context: path.join(__dirname, './client'),
  entry: {
    index: ['./index.html', './index.js'],
    vendor: ['react']
  },
  output: {
    path: path.join(__dirname, './static'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        include: /client/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        include: /client/,
        loaders: [
          'style',
          'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss'
        ]
      },
      {
        test: /\.css$/,
        exclude: /client/,
        loader: 'style!css'
      },
      {
        test: /\.json$/,
        exclude: /client/,
        loader: 'json'
      },
      {
        test: /\.js$/,
        exclude: /client/,
        loader: 'transform/cacheable?brfs'
      },
      {
        test: /\.(js|jsx)$/,
        include: /client/,
        loader: 'react-hot!babel'
      }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      webworkify: 'webworkify-webpack'
    }
  },
  postcss: [
    rucksack({
      autoprefixer: true
    })
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  bail: process.env.TRAVIS
}

if (isDev) {
  config.entry.index.push('webpack-hot-middleware/client')
}

module.exports = config
