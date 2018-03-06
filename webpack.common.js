'use strict';

// Modules
var path = require('path')
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLess = new ExtractTextPlugin({
  filename: "[chunkhash:6].app.css"
});

module.exports = {
  module : {
    rules: [
    // {
    //   enforce: 'pre',
    //   test: /\.js$/,
    //   loader: 'eslint-loader',
    //   query: {
    //     esModules: true
    //   }
    // },
    {
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory',
      exclude: /node_modules/
    },
    {
      test: /\.tpl.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true,
          removeComments: true,
          collapseWhitespace: true
        }
      }]
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: false
          }
        }, 'postcss-loader']
      })
    },
    {
      test: /\.less$/,
      use: extractLess.extract({
          use: [
            'css-loader',
            'postcss-loader',
            'less-loader'
          ],
          fallback: "style-loader"
      })
    },
    {
      test: /\.(png|jpg|jpeg|gif|ico)$/,
      loader: 'url-loader?name=img/[name].[ext]&limit=10000'
    },
    {
      test: /\.(woff|woff2|ttf|eot|svg)$/,
      loader: 'url-loader?name=fonts/[name].[ext]'
    }
    ]
  },
  plugins : [
    extractLess
  ],
  resolve: {
    extensions: ['.js', '.css'],
    alias: {
      uirouter: '@uirouter/angularjs/release/ui-router-angularjs.min.js',
      jquery: 'jquery/dist/jquery.min.js'
    }
  },
}
