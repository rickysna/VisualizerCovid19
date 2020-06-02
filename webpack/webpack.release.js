const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const devController = require('./webpack.dev')();
const packageJSON = require("../package");

module.exports = (env) => {
    function getOutputConfig() {
        return {
            path: path.resolve(__dirname, '../frontend/dist'),
            filename: '[name].bundle.js',
            publicPath: packageJSON.url
        }
    }

    function getWebpackPlugins(env) {
        const plugins = devController.getWebpackPlugins(env);
        return plugins.concat([
            new BundleAnalyzerPlugin(),
            new webpack.IgnorePlugin(/@amcharts/),
            new UglifyJsPlugin()
        ]);
    }

    return {
        getOutputConfig,
        getWebpackPlugins
    }
};
