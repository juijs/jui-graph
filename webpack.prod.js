const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'production',
    entry: {
        'jui-graph': path.resolve(__dirname, 'bundles', 'production.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin()
        ]
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [ 'env' ]
                }
            }]
        }]
    },
    plugins: [
        new BundleAnalyzerPlugin()
    ]
}