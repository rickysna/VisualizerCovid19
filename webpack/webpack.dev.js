const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const packageJSON = require("../package");

module.exports = () => {
  function getOutputConfig() {
    return {
      path: path.resolve(__dirname, "../frontend/dist"),
      filename: "[name].bundle.js",
    };
  }

  function getWebpackPlugins(env) {
    return [
      new webpack.DefinePlugin({
        "process.env.dev": "true",
        "process.env.API_PORT": env.API_PORT,
      }),
    ];
  }

  function getModel() {
    return "development";
  }

  return {
    getOutputConfig,
    getWebpackPlugins,
    getModel,
  };
};
