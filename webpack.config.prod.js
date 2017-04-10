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
    // the entry point of our components,
    output: {
        filename: 'scripts/[name].[chunkhash].js',
        path: resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    target: 'web',

    context: resolve(__dirname, 'src'),

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.(png|svg|jpg)?$/,
                loader: 'file-loader?name=[name].[ext]&outputPath=/assets/&publicPath=/assets/',
                include: resolve(__dirname, 'src/assets'),
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?name=[name].[ext]&limit=10000&mimetype=application/font-woff&outputPath=/fonts/&publicPath=../',
            },
            {   test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=[name].[ext]&outputPath=/fonts/&publicPath=../',
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
            },
            {
                test: /\.scss$/,
                use: cssExtract.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?modules&importLoaders=1&localIdentName=__[name]_[local]_[hash:base64:5]', 'postcss-loader', 'sass-loader'],
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
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
            minChunks(module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            },
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
