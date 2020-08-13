const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const packageJSON = require("./package");
const webpack = require("webpack");

module.exports = (env) => {
  const mode = env.NODE_ENV;
  const controller = require(`./webpack/webpack.${mode}`)();
  const controllerPlugins = controller.getWebpackPlugins(env);
  return {
    entry: {
      main: path.resolve(__dirname, "./frontend/index.ts"),
    },
    devtool: "inline-source-map",
    devServer: {
      contentBase: path.resolve(__dirname, "dist"),
      port: 4000,
    },
    mode: controller.getModel(),
    output: controller.getOutputConfig(env),
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/](!@amcharts)[\\/]/,
            name: "vendor",
            chunks: "all",
          },
        },
      },
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1, // disable creating additional chunks
      }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.join(__dirname, "./frontend/index.html"),
        templateParameters: {
          url: packageJSON.url,
          description: packageJSON.description,
          title: packageJSON.title,
          NODE_ENV: mode,
        },
        title: packageJSON.title,
        meta: {
          keywords: packageJSON.keywords.join(","),
          description: packageJSON.description,
          author: packageJSON.author,
        },
      }),
    ].concat(controllerPlugins),
    module: {
      rules: [
        {
          test: /@am4charts/,
          use: env.NODE_ENV === "development" ? "null-loader" : "noop-loader",
        },
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /(node_modules|bower_components)/,
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "images/",
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "styles/",
              },
            },
          ],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "ejs-loader",
            }, {
              loader: "extract-loader",
            }, {
              loader: "html-loader?interpolate=require",
              options: {
                attributes: {
                  list: [
                    {
                      tag: "img",
                      attribute: "src",
                      type: "src",
                    },
                    {
                      tag: "link",
                      attribute: "href",
                      type: "src",
                    },
                    {
                      tag: "meta",
                      attribute: "content",
                      type: "src",
                      filter: (tag, attribute, attributes) => (
                        attributes.content && attributes.property === "og:image"
                      ),
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
  };
};
