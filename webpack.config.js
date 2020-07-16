const path = require("path");

module.exports = (env) => {
  const mode = env.NODE_ENV || "dev";
  const controller = require(`./webpack/webpack.${mode}`)();

  return {
    entry: {
      main: path.resolve(__dirname, "./frontend/index.ts"),
    },
    devtool: "inline-source-map",
    devServer: {
      contentBase: path.resolve(__dirname, "dist"),
      port: 4000,
      host: "0.0.0.0",
    },
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
    // mode: "development",
    plugins: controller.getWebpackPlugins(env),
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
