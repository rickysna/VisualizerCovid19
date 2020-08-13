const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = () => {
  function getOutputConfig() {
    return {
      path: path.resolve(__dirname, "../frontend/dist"),
      filename: "[name].bundle.js",
      // publicPath: packageJSON.url,
    };
  }

  function getWebpackPlugins(env) {
    return [
      new webpack.DefinePlugin({
        "process.env.dev": "false",
        "process.env.API_PORT": env.API_PORT,
      }),
      new webpack.IgnorePlugin(/@amcharts/),
      new UglifyJsPlugin(),
    ];
  }

  function getModel() {
    return "production";
  }

  return {
    getOutputConfig,
    getWebpackPlugins,
    getModel,
  };
};
