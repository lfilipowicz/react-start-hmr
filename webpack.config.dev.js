

const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcssConfig = require('./utils/postcss.config');

const cssExtract = new ExtractTextPlugin({ filename: 'css/[name].css', disable: false, allChunks: true });

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


        './app.js',
        // the entry point of our components
    ],
    output: {
        filename: 'js/bundle.js',
        // the output bundle

        path: resolve(__dirname, 'dist'),

        publicPath: '/',
        // necessary for HMR to know where to load the hot update chunks
    },

    target: 'web',

    context: resolve(__dirname, 'src'),

    devtool: 'eval',
    node: {
        fs: 'empty',
    },
    devServer: {
        hot: true,
        // enable HMR on the server

        contentBase: resolve(__dirname, 'dist'),
        // match the output path

        publicPath: '/',
        // match the output `publicPath`,
        historyApiFallback: true,
    },

    module: {
        rules: [
            {
                test: /\.(png|svg|jpg)?$/,
                loader: 'file-loader?name=[name].[ext]&outputPath=/assets/&publicPath=/assets/',
                include: resolve(__dirname, 'src/assets'),
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?name=[name].[ext]&limit=10000&mimetype=application/font-woff&publicPath=/fonts/',
            },
            {   test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=[name].[ext]&outputPath=/fonts/&publicPath=/fonts/',
                include: resolve(__dirname, 'node_modules/font-awesome'),
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
                include: resolve(__dirname, 'node_modules/'),
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]_[hash:4]', 'postcss-loader'],
                include: resolve(__dirname, 'src/'),
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]_[hash:4]', 'postcss-loader', 'sass-loader'],
            },
        ],
    },

    plugins: [
        cssExtract,
        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: false,
            options: {
                postcss: postcssConfig,
            },
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': process.env.NODE_ENV,
        }),


        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'template/index.html',
        }),
        // enable HMR globally

        new webpack.NamedModulesPlugin(),
        // prints more readable module names in the browser console on HMR updates
    ],
};
