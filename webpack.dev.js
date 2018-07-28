const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'examples', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: '[name].[hash].js'
    },
    optimization: {
        minimizer: [
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'examples/index.html'),
            filename: path.resolve(__dirname, 'out/index.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
            }
        }),
        new BundleAnalyzerPlugin()
    ],
    devServer: {
        port: 3000,
        inline: true,
        hot: false,
        open: true,
        contentBase: path.resolve(__dirname, 'out'),
        watchContentBase: true
    }
}