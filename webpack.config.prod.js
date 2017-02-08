const { resolve } = require('path');
const webpack = require('webpack');

/* PostCss */
const postcss = require('postcss');
const autoprefixer = require( 'autoprefixer');
const postcssFixes = require('postcss-fixes');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cssExtract = new ExtractTextPlugin({filename: 'css/[name].css', disable: false, allChunks: true });

module.exports = {
  entry: './index.js',
    // the entry point of our app,
  output: {
    filename: 'bundle_[hash:5].js',
    // the output bundle

    path: resolve(__dirname, 'dist'),

    publicPath: '/'
      // necessary for HMR to know where to load the hot update chunks
  },
   node: {
      'fs' : 'empty'
   },
    target: 'web',

  context: resolve(__dirname, 'src'),

  //devtool: 'source-map',

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
        use: cssExtract.extract({
            fallbackLoader: 'style-loader',
            loader: ['css-loader?modules&importLoaders=1&localIdentName=__[hash:base64:5]', 'postcss-loader']}),

      },
    ],
  },

  plugins: [
      cssExtract,
      new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'template/index.html'
      }),

      new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
      }),

      new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false,
          options: {
              postcss: [
                  postcssFixes(),
                  autoprefixer({browsers:['last 2 versions']})
              ]
          }
      }),
      new webpack.optimize.UglifyJsPlugin({
          beautify: false,
          mangle: {
              screw_ie8: true,
              keep_fnames: true
          },
          compress: {
              screw_ie8: true
          },
          comments: false
      })
  ],
};
