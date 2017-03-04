const { resolve } = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
/* PostCss */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcssConfig = require('./utils/postcss.config');

const cssExtract = new ExtractTextPlugin({ filename: 'css/[name]_[hash:5].css', disable: false, allChunks: true });

module.exports = {
    entry: ['./app.js'],
    // the entry point of our app,
    output: {
        filename: 'js/bundle_[hash:5].js',
        // the output bundle

        path: resolve(__dirname, 'dist'),

        publicPath: '/',
        // necessary for HMR to know where to load the hot update chunks
    },

    target: 'web',

    context: resolve(__dirname, 'src'),

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.png$/,
                use: 'file-loader?name=[name].[ext]&outputPath=/assets/&publicPath=/assets/',
            },
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: cssExtract.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader'],
                }),
            },
            {
                test: /\.scss$/,
                use: cssExtract.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?modules&importLoaders=1&localIdentName=__[hash:base64:5]', 'postcss-loader', 'sass-loader'],
                }),

            },
        ],
    },

    plugins: [
        cssExtract,
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'template/index.html',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options: {
                postcss: postcssConfig,
            },
        }),
        new UglifyJsPlugin({
            sourceMap: true,
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true,
            },
            compress: {
                screw_ie8: true,
            },
            comments: false,
        }),
    ],
};
