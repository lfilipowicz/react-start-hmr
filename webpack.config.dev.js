const { resolve } = require('path');
const webpack = require('webpack');

/* PostCss */
const autoprefixer = require( 'autoprefixer');
const postcssFixes = require('postcss-fixes');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates


    './index.js'
    // the entry point of our app
  ],
  output: {
    filename: 'bundle.js',
    // the output bundle

    path: resolve(__dirname, 'dist'),

    publicPath: '/'
      // necessary for HMR to know where to load the hot update chunks
  },
   node: {
      'fs' : 'empty',
   },
    target: 'web',

  context: resolve(__dirname, 'src'),

  devtool: 'inline-source-map',

  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: resolve(__dirname, 'dist'),
    // match the output path

    publicPath: '/'
    // match the output `publicPath`
  },

  module: {
    rules: [
        { test: /\.png$/, use: 'url-loader?limit=100000' },
        { test: /\.jpg$/, use: 'file-loader' },

      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=__[hash:base64:5]',
          'postcss-loader',
        ],
      },
    ],
  },

  plugins: [
      new StyleLintPlugin({
          files: './src/**.*/*.css'
      }),
      new webpack.LoaderOptionsPlugin({
          minimize: false,
          debug: false,
          options: {
              postcss: [
                  postcssFixes(),
                  autoprefixer({browsers:['last 2 versions']})
              ]
          }
      }),
      new webpack.DefinePlugin({
          'process.env.NODE_ENV': process.env.NODE_ENV
      }),


    new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'template/index.html'
      }),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates
  ],
};
