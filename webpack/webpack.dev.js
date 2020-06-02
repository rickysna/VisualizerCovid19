const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const packageJSON = require("../package");

module.exports = () => {
    function getOutputConfig() {
        return {
            path: path.resolve(__dirname, '../frontend/dist'),
            filename: '[name].bundle.js'
        }
    }

    function getWebpackPlugins(env) {
        const develop_mode = env.NODE_ENV === 'development';
        return [
            new webpack.DefinePlugin({
                'process.env.development': JSON.stringify(develop_mode),
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1, // disable creating additional chunks
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.join(__dirname, '../frontend/index.html'),
                templateParameters: {
                    url: packageJSON['url'],
                    description: packageJSON.description,
                    title: packageJSON['title'],
                },
                title: packageJSON['title'],
                meta: {
                    "keywords": packageJSON.keywords.join(','),
                    "description": packageJSON.description,
                    "author": packageJSON.author,
                }
            }),
        ];
    }

    return {
        getOutputConfig,
        getWebpackPlugins
    }
};
