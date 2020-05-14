const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env) => {
    const develop_mode = env.NODE_ENV === 'development';
    let plugins = [
        new webpack.DefinePlugin({
            'process.env.development':JSON.stringify(env.NODE_ENV === 'development'),
        }),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1, // disable creating additional chunks
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/assets/index.html'
        }),
    ];

    if (!develop_mode) {
        plugins = plugins.concat([
            new BundleAnalyzerPlugin(),
            new webpack.IgnorePlugin(/@amcharts/),
            new UglifyJsPlugin()
        ]);
    }

    return {
        entry: {
            main: path.resolve(__dirname, './src/index.ts')
        },
        devtool: 'inline-source-map',
        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            port: 4000,
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].bundle.js',
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/](!@amcharts)[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                    }
                }
            }
        },
        // mode: "development",
        plugins,
        module: {
            rules: [
                {
                    test: /@am4charts/,
                    use: env.NODE_ENV === 'development' ? 'null-loader' : 'noop-loader'
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /(node_modules|bower_components)/,
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'images/'
                            }
                        },
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'styles/'
                            }
                        },
                    ],
                },
                {
                    test: /\.(html)$/,
                    use: {
                        loader: 'html-loader',
                        options: {
                            attributes: {
                                list: [
                                    {
                                        tag: 'img',
                                        attribute: 'src',
                                        type: 'src'
                                    },
                                    {
                                        tag: 'link',
                                        attribute: 'href',
                                        type: 'src'
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js']
        }
    }
};
