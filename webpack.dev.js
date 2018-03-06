'use strict';

// Modules
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackMerge = require('webpack-merge')

var commonConfig = require('./webpack.common')

module.exports = webpackMerge(commonConfig, {
  entry: {
    vendor: ['angular', 'jQuery'],
    app: './main',
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      },
      __DEV__: true,
      __PROD__: false
    }),
    new HtmlWebpackPlugin({
      title: '',
      template: './src/index.html',
      inject: 'body',
      staticPath: ''
    })
  ],
  output: {
    path: __dirname + '/dist',
    publicPath: '',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  devServer: {
    contentBase: './',
    stats: 'minimal',
    historyApiFallback: true,
    hot: true,
    port: 5000
  }
})
