const path = require('path');
const devController = require('./webpack/webpack.dev')();
const releaseController = require('./webpack/webpack.release')();

module.exports = (env) => {
    const develop_mode = env.NODE_ENV === 'development';
    const controller = develop_mode ? devController : releaseController;

    return {
        entry: {
            main: path.resolve(__dirname, './frontend/src/index.ts')
        },
        devtool: 'inline-source-map',
        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            port: 4000,
        },
        output: controller.getOutputConfig(env),
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
        plugins: controller.getWebpackPlugins(env),
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
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'ejs-loader'
                        }, {
                            loader: 'extract-loader'
                        }, {
                            loader: 'html-loader?interpolate=require',
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
                                        },
                                        {
                                            tag: 'meta',
                                            attribute: 'content',
                                            type: 'src',
                                            filter: (tag, attribute, attributes) => {
                                                return (
                                                    attributes.content &&
                                                    attributes.property === 'og:image'
                                                )
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js']
        }
    }
};
